document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
});

// Mock data for rooms to ensure UI looks good even if backend isn't connected yet
const MOCK_ROOMS = [
    {
        id: 1,
        roomName: "Deluxe Ocean View",
        location: "Mumbai",
        price: 299,
        availability: true,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
        description: "Experience the ultimate luxury with a panoramic view of the ocean. Features a king-sized bed and a private balcony.",
        rating: 4.8,
        reviews: 124,
        features: ["King Bed", "Ocean View", "Free Wifi"]
    },
    {
        id: 2,
        roomName: "Executive Suite",
        location: "Pune",
        price: 450,
        availability: true,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        description: "A spacious suite designed for business and leisure. Includes a separate living area, work desk, and premium amenities.",
        rating: 5.0,
        reviews: 89,
        features: ["King Bed", "City View", "Mini Bar"]
    },
    {
        id: 3,
        roomName: "Standard Double",
        location: "Lonavala",
        price: 150,
        availability: true,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        description: "Perfect for families or friends. Comfortable, modern, and equipped with everything you need for a great stay.",
        rating: 4.2,
        reviews: 56,
        features: ["2 Queen Beds", "Mountain View", "Coffee"]
    },
    {
        id: 4,
        roomName: "Presidential Penthouse",
        location: "Mahabaleshwar",
        price: 1200,
        availability: true,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
        description: "The epitome of luxury. This penthouse offers unparalleled comfort, a private pool, and 24/7 butler service.",
        rating: 4.9,
        reviews: 32,
        features: ["Private Pool", "Butler Service", "3 Bedrooms"]
    },
    {
        id: 5,
        roomName: "Cozy Single Room",
        location: "Nashik",
        price: 99,
        availability: false,
        image: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=800&q=80",
        description: "A snug and affordable option for solo travelers. Includes a comfortable bed and essential amenities.",
        rating: 4.0,
        reviews: 45,
        features: ["Single Bed", "Free Wifi", "Breakfast"]
    },
    {
        id: 6,
        roomName: "Family Suite",
        location: "Solapur",
        price: 350,
        availability: true,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
        description: "Spacious enough for the whole family. Features multiple beds, a small kitchenette, and a kid's play area.",
        rating: 4.7,
        reviews: 112,
        features: ["Multiple Beds", "Kitchenette", "Living Area"]
    },
    {
        id: 7,
        roomName: "Heritage Villa",
        location: "Aurangabad",
        price: 250,
        availability: true,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
        description: "Experience historical charm with modern amenities near the famous caves.",
        rating: 4.5,
        reviews: 78,
        features: ["Heritage Decor", "Pool Access", "Guided Tours"]
    },
    {
        id: 8,
        roomName: "Beachside Retreat",
        location: "Alibaug",
        price: 320,
        availability: true,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
        description: "Relax by the shore with direct beach access and stunning sunsets.",
        rating: 4.6,
        reviews: 95,
        features: ["Beach Access", "Seafood Dining", "Spa Services"]
    }
];

async function loadRooms() {
    const container = document.getElementById('rooms-container');
    const loading = document.getElementById('loading');
    
    // Get location from query param
    const urlParams = new URLSearchParams(window.location.search);
    const locationQuery = urlParams.get('location');
    
    // Update title if location is set
    if (locationQuery) {
        const titleEl = document.querySelector('h2');
        if (titleEl) titleEl.textContent = `Available Rooms in ${locationQuery}`;
    }
    
    try {
        setTimeout(() => {
            loading.style.display = 'none';
            container.style.display = 'grid';
            
            let filteredRooms = MOCK_ROOMS;
            if (locationQuery) {
                filteredRooms = MOCK_ROOMS.filter(room => 
                    room.location && room.location.toLowerCase().includes(locationQuery.toLowerCase())
                );
            }
            
            if (filteredRooms.length === 0) {
                container.style.display = 'block';
                container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fa-solid fa-hotel fa-3x" style="margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No rooms found</h3>
                    <p>We couldn't find any rooms matching "${locationQuery}". Try another destination.</p>
                    <a href="rooms.html" class="btn btn-primary" style="margin-top: 1rem;">View All Rooms</a>
                </div>`;
            } else {
                renderRooms(filteredRooms);
                // Also store the active filtered list globally for sorting
                window.currentActiveRooms = filteredRooms;
            }
        }, 800);

    } catch (error) {
        console.error('Error fetching rooms:', error);
        loading.innerHTML = '<p style="color: var(--error-color);">Failed to load rooms. Please try again later.</p>';
    }
}

function renderRooms(rooms) {
    const container = document.getElementById('rooms-container');
    container.innerHTML = '';

    rooms.forEach(room => {
        // Generate stars based on rating
        const fullStars = Math.floor(room.rating);
        const halfStar = room.rating % 1 >= 0.5;
        let starsHtml = '';
        for(let i=0; i<fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
        if(halfStar) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for(let i=0; i<emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';

        const featuresHtml = room.features ? room.features.map(f => `<span><i class="fa-solid fa-check" style="color: var(--primary-color);"></i> ${f}</span>`).join(' ') : '';

        const bookBtn = `<div style="display: flex; gap: 0.5rem;"><a href="room-details.html?id=${room.id}" class="btn btn-outline" style="flex: 1;">View Details</a>${room.availability ? `<a href="booking.html?room=${room.id}" class="btn btn-primary" style="flex: 1;">Book Now</a>` : `<button class="btn btn-primary" style="flex: 1; opacity: 0.5; cursor: not-allowed;" disabled>Full</button>`}</div>`;

        const html = `
            <div class="room-card">
                <a href="room-details.html?id=${room.id}" style="display: block; overflow: hidden;"><img src="${room.image}" alt="${room.roomName}" class="room-image" style="transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></a>
                <div class="room-content">
                    <div class="room-header">
                        <h3 class="room-title">${room.roomName} <span style="font-size: 0.875rem; color: var(--text-muted); font-weight: 500; display: block;"><i class="fa-solid fa-location-dot"></i> ${room.location}</span></h3>
                        <div class="room-price">$${room.price} <span>/night</span></div>
                    </div>
                    <div class="room-rating">
                        ${starsHtml}
                        <span>${room.rating} (${room.reviews} reviews)</span>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.4;">
                        ${room.description}
                    </p>
                    <div class="room-features" style="gap: 0.5rem; flex-wrap: wrap;">
                        ${featuresHtml}
                    </div>
                    ${bookBtn}
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// Sorting logic
document.getElementById('sort-rooms')?.addEventListener('change', (e) => {
    let sortedRooms = [...(window.currentActiveRooms || MOCK_ROOMS)];
    if (e.target.value === 'price-asc') {
        sortedRooms.sort((a, b) => a.price - b.price);
    } else if (e.target.value === 'price-desc') {
        sortedRooms.sort((a, b) => b.price - a.price);
    } else if (e.target.value === 'rating') {
        sortedRooms.sort((a, b) => b.rating - a.rating);
    }
    renderRooms(sortedRooms);
});
