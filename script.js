document.getElementById('popupButton').addEventListener('click', function() {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    popup.style.top = `${Math.random() * 80 + 10}%`;
    popup.style.left = `${Math.random() * 80 + 10}%`;
    
    popup.style.fontSize = `${Math.random() * 30 + 15}px`;

    fetchRandomGif().then(gifUrl => {
        popup.innerHTML = `
            <img src="${gifUrl}" alt="Random GIF" class="popup-image">
            <span class="close" onclick="closePopup(this)">X</span>
        `;
        
        const { textColor, backgroundColor } = getContrastingColors();
        popup.style.color = textColor;
        popup.style.backgroundColor = backgroundColor;

        document.body.appendChild(popup);
        popup.style.display = 'block';

        let closeButton = popup.querySelector('.close');
        let shrinkingTime = 0;
        let shrinkingInterval = setInterval(() => {
            shrinkingTime++;
            closeButton.classList.add('shrinking');
            closeButton.style.fontSize = (24 - shrinkingTime) + 'px';
            if (shrinkingTime > 10) {
                clearInterval(shrinkingInterval);
            }
        }, 1000);

        makePopupDraggable(popup);
    }).catch(error => {
        console.error('Error fetching GIF:', error);
        popup.innerHTML = `
            <p>Oops! Something went wrong. Try again later.</p>
            <span class="close" onclick="closePopup(this)">X</span>
        `;
        document.body.appendChild(popup);
    });
});

function closePopup(button) {
    button.closest('.popup').remove();
}

function fetchRandomGif() {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=CA3VZiFgTB6rkUdaql3pypFVPiRgoqfh&tag=&rating=G`; // Look a free API key

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Giphy API response:', data);
            if (data.data && data.data.images && data.data.images.original) {
                const gifUrl = data.data.images.original.url;
                console.log('GIF found:', gifUrl);
                return gifUrl;
            } else {
                throw new Error('No GIF found');
            }
        })
        .catch(error => {
            console.error('Error fetching GIF:', error);
            throw error;
        });
}

function getContrastingColors() {
    const backgroundColor = getRandomColor();
    const textColor = isLight(backgroundColor) ? '#000000' : '#FFFFFF';
    return { backgroundColor, textColor };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isLight(color) {
    const rgb = hexToRgb(color);
    const brightness = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return brightness > 128;
}

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return { r, g, b };
}

function makePopupDraggable(popup) {
    let isDragging = false;
    let offsetX, offsetY;

    popup.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
        popup.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        popup.style.cursor = 'move';
    });
}
