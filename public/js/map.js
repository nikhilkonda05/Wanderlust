

      mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: listing.geometry.coordinates, // starting position [longitude, latitude]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });


        console.log(listing.geometry.coordinates);

        const marker = new mapboxgl.Marker({color : "red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}).setHTML(
                `<h4> ${listing.title} </h4> <p> Exact Locatoin will be provide after booking  </p>`
            ))
        .addTo(map);