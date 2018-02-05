using Rebellion.Companion.Core.Resources;

namespace Rebellion.Companion.Core.Systems
{
    public class Coruscant : System
    {
        private SystemStatus _status = SystemStatus.ImperialLoyalty;

        public Coruscant()
            : base("Coruscant", 1, ResourceIcon.YellowTriangle)
        {
        }

        public override SystemStatus Status
        {
            get => _status;
            set
            {
                switch (value)
                {
                    case SystemStatus.RebelLoyalty:
                    case SystemStatus.Neutral:
                    case SystemStatus.Subjugated:
                        return;
                }

                _status = value;
            }
        }
    }
}