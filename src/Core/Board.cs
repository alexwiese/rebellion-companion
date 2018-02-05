using System;
using System.Collections.Generic;
using System.Linq;
using Rebellion.Companion.Core.Resources;
using Rebellion.Companion.Core.Systems;

namespace Rebellion.Companion.Core
{
    public class Board
    {
        public Board()
            : this(SystemCollections.Default)
        {
        }

        public Board(IEnumerable<Systems.System> planets)
        {
            Systems = planets.ToDictionary(p => p.Name);
        }

        public Dictionary<string, Systems.System> Systems { get; }

        public string GetFormattedBuildResults(Faction faction)
        {
            var buildResults = GetBuildResults(faction)
                .GroupBy(p => new { p.Name, p.QueuePosition })
                .OrderBy(p => p.Key.Name)
                .ThenBy(p => p.Key.QueuePosition)
                .Select(p => $"{p.Count()}x {p.Key.Name} on {p.Key.QueuePosition}");

            return string.Join(Environment.NewLine, buildResults);
        }

        public IEnumerable<BuildResult> GetBuildResults(Faction faction)
        {
            return Systems
                .Values
                .Select(p => p.GetResources(faction)
                    .Select(b => b.Build(faction)))
                .SelectMany(b => b);
        }
    }
}