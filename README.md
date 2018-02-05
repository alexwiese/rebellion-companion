# Rebellion Companion

Building blocks of Rebellion Companion apps/services.

Demo site:

http://alexwiese.github.io/rc

Example usage:

	var board = new Board();

	// Set Rebel systems' status
	board.Systems["Mon Calamari"].Status = SystemStatus.RebelLoyalty;
	board.Systems["Kashyyk"].Status = SystemStatus.RebelLoyalty;

	// Set Imperial systems' status
	board.Systems["Mandalore"].Status = SystemStatus.ImperialLoyalty;
	board.Systems["Utapau"].Status = SystemStatus.ImperialLoyalty;
	board.Systems["Corellia"].Status = SystemStatus.Subjugated;

	// Get build results for both factions
	board.GetFormattedBuildResults(Faction.Rebellion).Dump(nameof(Faction.Rebellion));
	board.GetFormattedBuildResults(Faction.Empire).Dump(nameof(Faction.Empire));
  
### Output:

```
Rebellion
---------

1x Mon Calamari Cruiser on 3
3x Rebel Trooper on 1
1x X-Wing, Y-Wing, or Rebel Transport on 1
1x X-Wing, Y-Wing, or Rebel Transport on 3 


Empire
------

1x Assault Carrier on 3
1x Star Destroyer on 3
2x Stormtrooper on 1
1x TIE Fighter on 1
1x TIE Fighter on 3
