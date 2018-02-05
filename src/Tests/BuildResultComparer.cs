using System;
using System.Collections.Generic;
using Rebellion.Companion.Core.Resources;

namespace Tests
{
    public class BuildResultComparer : IEqualityComparer<BuildResult>
    {
        public bool Equals(BuildResult x, BuildResult y) => x?.Name == y?.Name && x?.QueuePosition == y?.QueuePosition;

        public int GetHashCode(BuildResult obj) => Tuple.Create(obj?.Name, obj?.QueuePosition).GetHashCode();
    }
}