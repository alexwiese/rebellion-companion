using System.Linq;
using Rebellion.Companion.Core;
using Rebellion.Companion.Core.Resources;
using Rebellion.Companion.Core.Systems;
using Xunit;

namespace Tests
{
    public class BoardTests
    {
        [Fact]
        public void Cctr_ForDefaultBoard_ShouldGiveDefaultImperialUnits()
        {
            // Arrange
            var board = new Board();

            // Act
            var results = board.GetBuildResults(Faction.Empire).ToList();

            // Assert
            Assert.Equal(new [] { new BuildResult(ResourceNames.Stormtrooper, 1) }, results, new BuildResultComparer());
        }

        [Fact]
        public void Cctr_ForDefaultBoard_ShouldGiveDefaultRebelUnits()
        {
            // Arrange
            var board = new Board();

            // Act
            var results = board.GetBuildResults(Faction.Rebellion);

            // Assert
            Assert.Equal(new[] { new BuildResult(ResourceNames.XWingYWingTransport, 1), new BuildResult(ResourceNames.RebelTrooper, 1) }, results, new BuildResultComparer());
        }

        [Fact]
        public void Status_OfSubjugation_ShouldGiveFirstUnitOnly()
        {
            // Arrange
            var board = new Board();
            var system = board.Systems["Mon Calamari"];
            system.Status = SystemStatus.Subjugated;

            // Act
            var results = system.GetResources(Faction.Empire).ToList();
            
            // Assert
            Assert.Single(results);
            Assert.Equal(ResourceIcon.BlueTriangle, results.First().ResourceIcon );
            Assert.Equal(3, results.First().BuildQueuePosition );
        }

        [Fact]
        public void Status_OfImperialLoyalty_ShouldGiveBothUnits()
        {
            // Arrange
            var board = new Board();
            var system = board.Systems["Mon Calamari"];
            system.Status = SystemStatus.ImperialLoyalty;

            // Act
            var results = system.GetResources(Faction.Empire).ToList();

            // Assert
            Assert.Equal(2, results.Count);
            Assert.Equal(ResourceIcon.BlueTriangle, results.First().ResourceIcon);
            Assert.Equal(3, results.First().BuildQueuePosition);
            Assert.Equal(ResourceIcon.BlueSquare, results.Last().ResourceIcon);
            Assert.Equal(3, results.Last().BuildQueuePosition);
        }
    }
}
