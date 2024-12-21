const img_url = document.querySelector('#img-url'),
    upload_file_btn = document.querySelector('#upload-file-btn'),
    copy_text = document.querySelector('#copy-text'),
    img_result = document.querySelector('#img-result'),
    converted_text = document.querySelector('#converted-text');

// Select image URL input on click
img_url.onclick = () => {
    img_url.select();
};

// Copy the recognized text to clipboard
copy_text.onclick = () => {
    copy_text.setAttribute('title', "Copied.");
    setTimeout(() => {
        copy_text.setAttribute('title', "Copy text.");
    }, 2000);

    if (converted_text.value !== '') {
        navigator.clipboard.writeText(converted_text.value);
    }
};

// Event listener for image URL change
img_url.addEventListener('change', async function () {
    const url = this.value.trim();
    if (url !== '' && isValidImageUrl(url)) {
        img_result.src = url;
        try {
            displayLoading(true);
            await recognizeText(url);
        } finally {
            displayLoading(false);
        }
    } else {
        alert('Please enter a valid image URL.');
    }
});

// Event listener for file upload
upload_file_btn.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            img_result.src = reader.result;
            recognizeText(file); // Directly pass the file
        };
        reader.readAsDataURL(file);
    }
});

// Function to validate if the URL points to an image
function isValidImageUrl(url) {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
}

// Function to recognize text using Tesseract.js
async function recognizeText(input) {
    try {
        const result = await Tesseract.recognize(
            input, // Can be a file or image URL
            'eng', // Specify language
            {
                logger: info => console.log(info) // Log progress
            }
        );
        converted_text.value = result.data.text; // Display extracted text
    } catch (error) {
        console.error("Error during text recognition:", error);
        alert("Failed to extract text. Please try again.");
    }
}

// Function to show/hide loading indicator
function displayLoading(isLoading) {
    if (isLoading) {
        converted_text.placeholder = "Extracting text, please wait...";
    } else {
        converted_text.placeholder = "Converted text of image";
    }
}
