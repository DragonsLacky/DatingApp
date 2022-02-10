using api.Interface;
using api.repository.impl;
using api.repository.interfaces;
using AutoMapper;

namespace api.data;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public UnitOfWork(DataContext context, IMapper mapper)
    {
        _mapper = mapper;
        _context = context;
    }

    public IUserRepository UserRepository => new UserRepository(_context, _mapper);

    public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);

    public ILikesRepository LikesRepository => new LikesRepository(_context);

    public bool HasChanges()
    {
        return _context.ChangeTracker.HasChanges();
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}