mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listinglocation.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listinglocation.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${listinglocation.location}</h5><P>Wolcome to WanderLust</p>`))
    .addTo(map);
