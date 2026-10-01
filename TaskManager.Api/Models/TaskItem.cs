namespace TaskManager.Api.Models
{
    public class TaskItem
    {
        public int id { set; get; }
        public string Title { set; get; } = string.Empty;
        public string? Description { set; get; }

        public bool iscompleted { set; get; }
        public DateTime Created_At { set; get; }
    }
}