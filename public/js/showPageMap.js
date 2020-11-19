



mapboxgl.accessToken ='pk.eyJ1Ijoia2V2bGl2ZSIsImEiOiJja2hreHNpN3AwdW8xMnhwZmNmemdjdWV0In0.CU-UA0lRN23uVgf3PuZnZA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: campground.geometry.coordinates, 
    zoom: 10
});
var marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)





