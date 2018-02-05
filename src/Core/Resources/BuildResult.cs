namespace Rebellion.Companion.Core.Resources
{
    public class BuildResult
    {
        public BuildResult(string name, int queuePosition)
        {
            Name = name;
            QueuePosition = queuePosition;
        }

        public string Name { get; }
        public int QueuePosition { get; }
    }
}