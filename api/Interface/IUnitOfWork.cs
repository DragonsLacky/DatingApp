using api.repository.interfaces;

namespace api.Interface;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikesRepository LikesRepository { get; }

    Task<bool> SaveChangesAsync();

    bool HasChanges();
}