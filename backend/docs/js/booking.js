document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    if (!localStorage.getItem('token')) {
        alert('Please login to book a room.');
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (!roomId) {
        window.location.href = 'rooms.html';
        return;
    }

    document.getElementById('roomId').value = roomId;

    // In a real app, fetch room details from backend
    // Simulate fetching room details for the summary card
    const roomDetails = {
        1: { name: "Deluxe Ocean View", price: 299, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", rating: 4.8 },
        2: { name: "Executive Suite", price: 450, img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", rating: 5.0 },
        3: { name: "Standard Double", price: 150, img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", rating: 4.2 },
        4: { name: "Presidential Penthouse", price: 1200, img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80", rating: 4.9 },
        5: { name: "Cozy Single Room", price: 99, img: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=800&q=80", rating: 4.0 },
        6: { name: "Family Suite", price: 350, img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", rating: 4.7 },
        7: { name: "Heritage Villa", price: 250, img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", rating: 4.5 },
        8: { name: "Beachside Retreat", price: 320, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", rating: 4.6 }
    };

    const room = roomDetails[roomId] || roomDetails[1];

    document.getElementById('summary-title').textContent = room.name;
    document.getElementById('summary-price').textContent = `$${room.price}`;
    document.getElementById('summary-img').src = room.img;

    // Calculate totals dynamically
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
        calculateTotal();
    });

    checkOutInput.addEventListener('change', calculateTotal);

    function calculateTotal() {
        if (checkInInput.value && checkOutInput.value) {
            const start = new Date(checkInInput.value);
            const end = new Date(checkOutInput.value);
            const diffTime = end - start;
            if (diffTime <= 0) return;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                document.getElementById('summary-nights').textContent = diffDays;
                const subtotal = diffDays * room.price;
                const tax = subtotal * 0.1; // 10% tax
                const total = subtotal + tax;
                document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
                document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
                document.getElementById('btn-total').textContent = ` $${total.toFixed(2)}`;
            }
        }
    }

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const errorMsg = document.getElementById('booking-error');
        const successMsg = document.getElementById('booking-success');
        const btn = document.getElementById('submit-btn');

        errorMsg.style.display = 'none';

        if (new Date(checkIn) >= new Date(checkOut)) {
            errorMsg.textContent = 'Check-out date must be after check-in date.';
            errorMsg.style.display = 'block';
            return;
        }

        const cardNum = document.getElementById('cardNumber').value;
        const cardLast4 = cardNum.length >= 4 ? cardNum.slice(-4) : 'XXXX';
        const totalText = document.getElementById('summary-total').textContent;

        const bookingData = {
            id: Math.floor(Math.random() * 9000) + 1000,
            roomId: parseInt(roomId),
            roomName: room.name,
            checkIn: checkIn,
            checkOut: checkOut,
            status: "CONFIRMED",
            totalPaid: totalText,
            paymentMethod: `Card ending in ${cardLast4}`,
            bookingDate: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };

        try {
            // Save to mock database in localStorage
            const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
            existingBookings.push(bookingData);
            localStorage.setItem('mockBookings', JSON.stringify(existingBookings));

            // Simulate payment processing
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Payment Successful!';
                btn.style.backgroundColor = 'var(--success-color)';

                successMsg.textContent = 'Generating receipt...';
                successMsg.style.display = 'block';

                setTimeout(() => {
                    window.location.href = `receipt.html?id=${bookingData.id}`;
                }, 1500);
            }, 2000);

        } catch (error) {
            errorMsg.textContent = 'Failed to process payment. Please try again.';
            errorMsg.style.display = 'block';
            if (btn) {
                btn.innerHTML = 'Confirm & Pay';
                btn.disabled = false;
            }
        }
    });
});
