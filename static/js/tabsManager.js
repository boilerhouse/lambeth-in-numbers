/* useful for testing or resetting when something goes wrong... */
var tabsManager = {
	selected: 1,
	options: {
		1: {
			name: "Example Tab 1",
			layout: 1,
			panels: {
				1: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	1,
					overlayMarkers: 	{selected: 1, options: []},
					map:				{zoom: 10, center: [51.459508,-0.117842]}
				},
				2: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	0,
					overlayMarkers: 	{selected: 1, options: []}
				}
			}
		},
		2: {
			name: "Example Tab 2",
			layout: 2,
			panels: {
				1: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	1,
					overlayMarkers: 	{selected: 1, options: []},
					map:				{zoom: 10, center: [51.459508,-0.117842]}
				},
				2: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	0,
					overlayMarkers: 	{selected: 1, options: []}
				}
			}
		},
		3: {
			name: "Example Tab 3",
			layout: 1,
			panels: {
				1: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	1,
					overlayMarkers: 	{selected: 1, options: []},
					map:				{zoom: 10, center: [51.459508,-0.117842]}
				},
				2: {
					baseLayers: 		{selected: 1, options: 1},
					includeUserData:	0,
					overlayMarkers: 	{selected: 1, options: []}
				}
			}
		}
	}
}
