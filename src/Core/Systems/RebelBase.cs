using Rebellion.Companion.Core.Resources;

namespace Rebellion.Companion.Core.Systems
{
    public class RebelBase : System
    {
        private SystemStatus _status = SystemStatus.RebelLoyalty;

        public RebelBase()
            : base("Rebel Base", 1, ResourceIcon.BlueTriangle, ResourceIcon.YellowTriangle)
        {
        }

        public override SystemStatus Status
        {
            get => _status;
            set
            {
                switch (value)
                {
                    case SystemStatus.ImperialLoyalty:
                    case SystemStatus.Neutral:
                    case SystemStatus.Subjugated:
                        return;
                }

                _status = value;
            }
        }
    }
}