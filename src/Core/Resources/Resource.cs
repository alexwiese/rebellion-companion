namespace Rebellion.Companion.Core.Resources
{
    public class Resource
    {
        public Resource(ResourceIcon resourceIcon, int buildQueuePosition)
        {
            ResourceIcon = resourceIcon;
            BuildQueuePosition = buildQueuePosition;
        }

        public ResourceIcon ResourceIcon { get; }

        public int BuildQueuePosition { get; }

        public BuildResult Build(Faction faction) => new BuildResult(GetResourceName(faction), BuildQueuePosition);

        private string GetResourceName(Faction faction)
        {
            switch (faction)
            {
                case Faction.Rebellion:
                    switch (ResourceIcon)
                    {
                        case ResourceIcon.BlueTriangle:
                            return ResourceNames.XWingYWingTransport;

                        case ResourceIcon.BlueCircle:
                            return ResourceNames.CorellianCorvette;

                        case ResourceIcon.BlueSquare:
                            return ResourceNames.MonCalamariCruiser;

                        case ResourceIcon.YellowTriangle:
                            return ResourceNames.RebelTrooper;

                        case ResourceIcon.YellowCircle:
                            return ResourceNames.Airspeeder;

                        case ResourceIcon.YellowSquare:
                            return ResourceNames.ShieldGeneratorIonCannon;
                    }

                    break;

                case Faction.Empire:
                    switch (ResourceIcon)
                    {
                        case ResourceIcon.BlueTriangle:
                            return ResourceNames.TieFighter;

                        case ResourceIcon.BlueCircle:
                            return ResourceNames.AssaultCarrier;

                        case ResourceIcon.BlueSquare:
                            return ResourceNames.StarDestroyer;

                        case ResourceIcon.YellowTriangle:
                            return ResourceNames.Stormtrooper;

                        case ResourceIcon.YellowCircle:
                            return ResourceNames.AtSt;

                        case ResourceIcon.YellowSquare:
                            return ResourceNames.AtAt;
                    }

                    break;
            }

            return null;
        }
    }
}