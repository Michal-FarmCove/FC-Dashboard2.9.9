// Movie data object containing information for each movie
const movieData = {
    "To the Moon!": {
        name: "To the Moon!",
        language: "English",
        startDate: "1st February 2025",
        endDate: "15th April 2025",
        poster: "posters/default-poster-01.png",
        status: "Proposed"
    },
    "Butterfly Effect": {
        name: "Butterfly Effect",
        language: "Hindi",
        startDate: "14th January 2025",
        endDate: "1st March 2025",
        poster: "posters/movie-poster2.png",
        status: "Planning"
    },
    "Echoes of Eternity": {
        name: "Echoes of Eternity",
        language: "Spanish",
        startDate: "1st March 2025",
        endDate: "30th June 2025",
        poster: "posters/movie-poster3.png",
        status: "Pre-production"
    },
    "Mission Impossible": {
        name: "Mission Impossible",
        language: "English",
        startDate: "15th December 2024",
        endDate: "30th March 2025",
        poster: "posters/movie-poster4.png",
        status: "Shooting"
    },
    "Interstellar": {
        name: "Interstellar",
        language: "English",
        startDate: "1st October 2024",
        endDate: "15th February 2025",
        poster: "posters/movie-poster5.png",
        status: "Post-production"
    },
    "Inception": {
        name: "Inception",
        language: "English",
        startDate: "1st June 2024",
        endDate: "30th December 2024",
        poster: "posters/movie-poster6.png",
        status: "Complete"
    },
    "Gravity": {
        name: "Gravity",
        language: "French",
        startDate: "1st April 2025",
        endDate: "30th July 2025",
        poster: "posters/movie-poster7.png",
        status: "Proposed"
    },
    "The Martian": {
        name: "The Martian",
        language: "English",
        startDate: "15th March 2025",
        endDate: "30th June 2025",
        poster: "posters/movie-poster.png",
        status: "Planning"
    }
};

// Function to update the film details page with the selected movie data
function updateFilmDetails() {
    try {
        // Get the selected movie from localStorage
        const selectedMovie = localStorage.getItem('selectedMovie');
        const movie = movieData[selectedMovie];

        if (!movie) {
            console.error('No movie selected or movie not found');
            return;
        }

        // Wait for DOM elements to be available
        const posterImg = document.querySelector('.logg-row img');
        const boxes = document.querySelectorAll('.box3');
        const phaseCircles = document.querySelectorAll('.logg-row [style*="border-radius: 50%"]');
        const phaseTexts = document.querySelectorAll('.logg-row [style*="margin-top: 10px"]');

        // Check if all required elements exist
        if (!posterImg || boxes.length < 4 || !phaseCircles.length || !phaseTexts.length) {
            console.error('Required DOM elements not found. Retrying in 100ms...');
            setTimeout(updateFilmDetails, 100); // Retry after 100ms
            return;
        }

        // Update movie poster
        posterImg.src = movie.poster;

        // Update movie details
        boxes[0].textContent = movie.name;
        boxes[1].textContent = movie.language;
        boxes[2].textContent = movie.startDate;
        boxes[3].textContent = movie.endDate;

        // Update production phase circles
        const phases = ['Proposed', 'Planning', 'Pre-production', 'Shooting', 'Post-production', 'Complete'];
        const currentPhaseIndex = phases.indexOf(movie.status);

        // Update each phase circle and text based on the current status
        phases.forEach((phase, index) => {
            if (phaseCircles[index] && phaseTexts[index]) {
                if (index === currentPhaseIndex) {
                    // Current phase
                    phaseCircles[index].style.backgroundColor = '#32B8CD';
                    phaseTexts[index].style.color = '#32B8CD';
                } else {
                    // Other phases
                    phaseCircles[index].style.backgroundColor = '#e0e0e0';
                    phaseTexts[index].style.color = '#666';
                }
            }
        });
    } catch (error) {
        console.error('Error updating film details:', error);
    }
}

// Initialize when the page loads
window.addEventListener('load', () => {
    // Try to update immediately
    updateFilmDetails();
    
    // Also try after a short delay to ensure all elements are rendered
    setTimeout(updateFilmDetails, 100);
});
