using System.Collections.Generic;
using System.Linq;
using Rebellion.Companion.Core.Resources;

namespace Rebellion.Companion.Core.Systems
{
    public class System
    {
        private readonly Resource[] _resources;

        public System(string name, int buildQueuePosition, params ResourceIcon[] resourceIcons)
        {
            _resources = resourceIcons.Select(r => new Resource(r, buildQueuePosition)).ToArray(); 
            Name = name;
        }

        public string Name { get; }

        public virtual SystemStatus Status { get; set; }

        public IEnumerable<Resource> GetResources(Faction faction)
        {
            switch (faction)
            {
                case Faction.Empire:
                    switch (Status)
                    {
                        case SystemStatus.ImperialLoyalty:
                            return _resources;

                        case SystemStatus.Subjugated:
                            return _resources.Take(1);
                    }
                    break;

                case Faction.Rebellion:
                    switch (Status)
                    {
                        case SystemStatus.RebelLoyalty:
                            return _resources;
                    }
                    break;
            }

            return Enumerable.Empty<Resource>();
        }
    }
}