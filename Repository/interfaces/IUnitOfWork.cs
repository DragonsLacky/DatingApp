namespace Repository.interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikesRepository LikesRepository { get; }

    Task<bool> SaveChangesAsync();

    bool HasChanges();
}