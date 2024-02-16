const facilities = {
    "Clubhouse": {
        "slots": [
            { "start": "10:00", "end": "16:00", "rate": 100 },
            { "start": "16:00", "end": "22:00", "rate": 500 }
        ]
    },
    "Tennis Court": {
        "rate": 50
    }
};

let bookingStatus = {};

function bookFacility() {
    const facility = document.getElementById('facility').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    
    if(!date || !startTime || !endTime || !facilities){
        alert("please enter all the inputs")
    }else{   
        const bookingResult = bookFacilityHelper(facility, date, startTime, endTime);
        displayBookingStatus(bookingResult);
    }
}

function bookFacilityHelper(facility, date, startTime, endTime) {
    if (bookingStatus[facility] && bookingStatus[facility][date]) {
        for (const slot of bookingStatus[facility][date]) {
            const slotStartTime = new Date(date + 'T' + slot.start);
            const slotEndTime = new Date(date + 'T' + slot.end);
            const bookingStartTime = new Date(date + 'T' + startTime);
            const bookingEndTime = new Date(date + 'T' + endTime);

            console.log(slot);

            if (
                (slotStartTime <= bookingStartTime && bookingStartTime < slotEndTime) ||
                (slotStartTime < bookingEndTime && bookingEndTime <= slotEndTime) ||
                (bookingStartTime <= slotStartTime && bookingEndTime >= slotEndTime)
            ) {
                return "Booking Failed, Already Booked";
            }
        }
    }

    let bookingAmount = 0;
    if (facilities[facility].slots) {
        for (const slot of facilities[facility].slots) {
            const slotStartTime = new Date(date + 'T' + slot.start);
            const slotEndTime = new Date(date + 'T' + slot.end);
            const bookingStartTime = new Date(date + 'T' + startTime);
            const bookingEndTime = new Date(date + 'T' + endTime);

            const latestStartTime = new Date(Math.max(slotStartTime, bookingStartTime));
            const earliestEndTime = new Date(Math.min(slotEndTime, bookingEndTime));
    
            if (latestStartTime < earliestEndTime) {
                const hours = (earliestEndTime - latestStartTime) / (1000 * 60 * 60);
                bookingAmount += hours * slot.rate;
            }
        }
    } else {
        const hours = (new Date(date + 'T' + endTime) - new Date(date + 'T' + startTime)) / (1000 * 60 * 60);
        bookingAmount += hours * facilities[facility].rate;
    }

    if (!bookingStatus[facility]) {
        bookingStatus[facility] = {};
    }
    if (!bookingStatus[facility][date]) {
        bookingStatus[facility][date] = [];
    }
    bookingStatus[facility][date].push({ start: startTime, end: endTime });

    return "Booked, Rs. " + bookingAmount;
}

function displayBookingStatus(bookingResult) {
    const statusElement = document.getElementById('booking-status');
    statusElement.textContent = bookingResult;
}
