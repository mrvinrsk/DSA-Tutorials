<?php
// Enable file uploads
ini_set('file_uploads', '1');

// Check if file uploads are enabled
if (ini_get('file_uploads')) {
    echo "File uploads are enabled";
} else {
    echo "File uploads are not enabled";
}
