using api.data;
using api.Dtos;
using api.Entities;
using api.Extensions;
using api.helpers;
using api.repository.interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.repository.impl;

public class MessageRepository : IMessageRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper)
    {
        _mapper = mapper;
        _context = context;
    }

    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Message> GetMessage(int id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = _context.Messages
                .OrderByDescending(msg => msg.MessageSent)
                .AsQueryable()
                .FilterByContainer(messageParams)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

        return await PagedList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
    {
        var messages = await _context.Messages
            .Include(u => u.Sender).ThenInclude(u => u.Photos)
            .Include(u => u.Recipient).ThenInclude(u => u.Photos)
            .Where
            (
                m =>
                (m.Recipient.UserName == currentUsername
                && m.Sender.UserName == recipientUsername
                && !m.RecipientDeleted)
                || (m.Recipient.UserName == recipientUsername
                && m.Sender.UserName == currentUsername
                && !m.SenderDeleted)
            )
            .OrderByDescending(m => m.MessageSent)
            .ToListAsync();

        var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientUsername == currentUsername).ToList();

        if (unreadMessages.Any())
        {
            unreadMessages.ForEach(msg => msg.DateRead = DateTime.Now);

            await _context.SaveChangesAsync();
        }

        return _mapper.Map<IEnumerable<MessageDto>>(messages);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}