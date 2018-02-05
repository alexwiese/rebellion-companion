using Rebellion.Companion.Core.Resources;

namespace Rebellion.Companion.Core.Systems
{
    public static class SystemCollections
    {
        public static System[] Default => new []
        {
            new RebelBase(),
            new System("Mon Calamari", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
            new System("Felucia", 1, ResourceIcon.YellowTriangle),
            new System("Mygeeto", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
            new System("Saleucami", 1, ResourceIcon.YellowCircle),
            new System("Kessel", 1, ResourceIcon.YellowTriangle),
            new System("Mandalore", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
            new System("Ord Mantell", 2, ResourceIcon.BlueCircle, ResourceIcon.YellowCircle),
            new System("Nal Hutta", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
            new System("Toydaria", 2, ResourceIcon.BlueCircle),
            new System("Kashyyk", 1, ResourceIcon.YellowTriangle, ResourceIcon.YellowTriangle),
            new System("Alderaan", 1, ResourceIcon.YellowTriangle),
            new System("Bothawui", 1, ResourceIcon.YellowCircle),
            new System("Malastare", 1, ResourceIcon.YellowTriangle),
            new System("Cato Neimoidia", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowCircle),
            new Coruscant(),
            new System("Rodia", 1, ResourceIcon.YellowTriangle),
            new System("Naboo", 1, ResourceIcon.YellowTriangle, ResourceIcon.BlueTriangle),
            new System("Sullust", 2, ResourceIcon.YellowTriangle, ResourceIcon.YellowSquare),
            new System("Corellia", 3, ResourceIcon.BlueTriangle, ResourceIcon.BlueSquare),
            new System("Geonosis", 2, ResourceIcon.BlueTriangle, ResourceIcon.YellowSquare),
            new System("Bespin", 1, ResourceIcon.YellowCircle),
            new System("Ryloth", 1, ResourceIcon.YellowTriangle),
            new System("Utapau", 3, ResourceIcon.BlueCircle, ResourceIcon.BlueSquare),
            new System("Mustafar", 2, ResourceIcon.BlueTriangle, ResourceIcon.BlueCircle)
        };
    }
}