<template>
    <div id="map" style="width: 100%; height: 450px;"></div>
</template>
  
<script setup>
  import { onMounted, ref, watch } from 'vue';
  
  const map = ref(null);
  
  const props = defineProps({
        locations: Array,
        selectedLocation: Object,
    });

  const initMap = () => {
    const mapElement = document.getElementById('map');
    map.value = new google.maps.Map(mapElement, {
      center: { lat: -34.5627, lng: -58.45829 },
      zoom: 13
    });
    map.value.markers = [];
    props.locations.forEach(location => {
      const marker = createMarker(location)
    });
  };
  
  const setEventInfoWindow = (marker,location) => {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="info-window">
          <h3 class="info-window__title">${location.title || ''}</h3>
           ${location.imageUrlFile ? `
              <img
                src="${location.imageUrlFile}"
                alt="image-default"
                class="img-fluid"
                style="max-width: 100%; height: auto"
              />
            ` : ''}
          <p class="info-window__detail">${location.detail || ''}</p>
          <p class="info-window__address">${location.address || ''}</p>
          <ul class="info-window__contact">
            <li class="info-window__contact-item">
              <span class="info-window__contact-label">Phone:</span>
              <span class="info-window__contact-value">${location.phone || ''}</span>
            </li>
            <li class="info-window__contact-item">
              <span class="info-window__contact-label">Social Network:</span>
              <a href="${location.socialNetworkLink || '#'}">${location.socialNetworkLink || ''}</a>
            </li>
          </ul>
        </div>
      `
    });
    marker.addListener('click', () => {
      infoWindow.open(map.value, marker);
    });
  };
  
  const setDinamicInfoWindow = (marker,location) => {
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="info-window">
          <h3 class="info-window__title">${location.title || ''}</h3>
           ${location.imageUrlFile ? `
              <img
                src="${location.imageUrlFile}"
                alt="image-default"
                class="img-fluid"
                style="max-width: 100%; height: auto"
              />
            ` : ''}
          <p class="info-window__detail">${location.detail || ''}</p>
          <p class="info-window__address">${location.address || ''}</p>
          <ul class="info-window__contact">
            <li class="info-window__contact-item">
              <span class="info-window__contact-label">Phone:</span>
              <span class="info-window__contact-value">${location.phone || ''}</span>
            </li>
            <li class="info-window__contact-item">
              <span class="info-window__contact-label">Social Network:</span>
              <a href="${location.socialNetworkLink || '#'}">${location.socialNetworkLink || ''}</a>
            </li>
          </ul>
        </div>
      `
    });
    infoWindow.open(map.value, marker);
  };

  const focusMarker = (marker,location) => {
    if (!map.value || !map.value.markers || !location.title) return;
    // Busco el marker perteneciente a este elemento
    if (marker) {
      setDinamicInfoWindow(marker,location)
      map.value.setCenter(marker.getPosition());
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null)
      }
      , 700);
    } else {
      console.error(`No se encontró un marcador con el título: ${location.title}`);
    }
  };
  
  const createMarker = (location) => {
  return new Promise((resolve, reject) => {
    if (location?.address != undefined && location?.address != null) {
      const geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({ address: location.address }, (results, status) => {
          if (status === 'OK') {
            const marker = new google.maps.Marker({
              map: map.value,
              position: results[0].geometry.location,
              title: location.title
            });
            setEventInfoWindow(marker, location);
            map.value.markers.push(marker);
            resolve(marker);
          } else {
            console.log('Fallo Geolocalizacion: ' + status + '.La direccion ' + location.address + ' no es correcta.');
            reject(new Error('Fallo la geolocalizacion'));
          }
        });
      } else {
        reject(new Error('Fallo la geolocalizacion'));
      }
    } else {
      reject(new Error('Fallo la geolocalizacion'));
    }
  });
};
  
  const setNewLocation = (newLocations) => {
    let newLoc = findDifferent(newLocations,map.value.markers)
    if(newLoc != undefined && newLoc != null && newLoc.address != null  && newLoc.address != undefined){
      createMarker(newLoc).then((response)=>{
        if(response != undefined && response != null && response.title != null){
          const marker = response
          if(marker != undefined != marker != null){
            focusMarker(marker,newLoc)
          }
        }
      })
    }
  };

  function findDifferent(newLocations, markers) {
    const titlesSet = new Set(markers.map(mk => mk.title));

    const differentLocation = newLocations.filter(nl => !titlesSet.has(nl.title))[0];

    return {
      id: differentLocation?.id,
      idDoc: differentLocation?.idDoc,
      title: differentLocation?.title,
      detail: differentLocation?.detail,
      address: differentLocation?.address,
      phone: differentLocation?.phone,
      timestamp: differentLocation?.timestamp,
      imageUrlFile: differentLocation?.imageUrlFile,
      imagePathFile: differentLocation?.imagePathFile,
      socialNetworkLink: differentLocation?.socialNetworkLink ?? null,
    };
  }
  
  onMounted(()=>{ 
    initMap() 
  });
  
  watch(() => props.selectedLocation, (newLocation) => {
    const selectedMarker = map.value.markers.find(marker => marker.title === newLocation.title);
    focusMarker(selectedMarker,newLocation);
  });

  watch(() => props.locations, (newLocations) => {
    setNewLocation(newLocations);
  });
</script>
  
<style scoped>
.info-window {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.info-window__title {
  margin-bottom: 5px;
  font-weight: bold;
}

.info-window__detail,
.info-window__address {
  margin-bottom: 10px;
}

.info-window__contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-window__contact-item {
  margin-bottom: 5px;
}

.info-window__contact-label {
  font-weight: bold;
  margin-right: 5px;
}

.info-window__contact-value,
.info-window__contact-link {
  color: #333;
}

.info-window__contact-link {
  text-decoration: none;
}
</style>