<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header('Content-Type: application/json');

if (!empty($_FILES['images'])) {
    ini_set('upload_max_filesize', '70M');
    ini_set('post_max_size', '2G');
    ini_set('max_file_uploads', '50');
    ini_set('memory_limit', '256M');
    set_time_limit(180);

    $uploadedFiles = $_FILES['images'];
    $outputFiles = [];
    $tempDir = '../temp/';

    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0777, true);
    }

    // Set fixed width or height for rescaling here
    $fixedWidth = $_POST['width'] ?? null; // e.g., 300
    $fixedHeight = $_POST['height'] ?? null; // e.g., null

    for ($i = 0; $i < count($uploadedFiles['name']); $i++) {
        $tempFile = $tempDir . $uploadedFiles['name'][$i];
        move_uploaded_file($uploadedFiles['tmp_name'][$i], $tempFile);

        // Resize the image
        list($width, $height, $imageType) = getimagesize($tempFile);

        // Calculate new width and height while maintaining aspect ratio
        if ($fixedWidth !== null) {
            $newWidth = $fixedWidth;
            $newHeight = intval($height * ($fixedWidth / $width));
        } elseif ($fixedHeight !== null) {
            $newWidth = intval($width * ($fixedHeight / $height));
            $newHeight = $fixedHeight;
        } else {
            $newWidth = $width;
            $newHeight = $height;
        }

        // Create source image based on image type
        switch ($imageType) {
            case IMAGETYPE_JPEG:
                $srcImage = imagecreatefromjpeg($tempFile);
                break;
            case IMAGETYPE_PNG:
                $srcImage = imagecreatefrompng($tempFile);
                break;
            case IMAGETYPE_GIF:
                $srcImage = imagecreatefromgif($tempFile);
                break;
            default:
                $srcImage = false;
        }

        if ($srcImage) {
            $dstImage = imagecreatetruecolor($newWidth, $newHeight);

            // Preserve transparency
            if ($imageType == IMAGETYPE_PNG) {
                imagealphablending($dstImage, false);
                imagesavealpha($dstImage, true);
                $transparent = imagecolorallocatealpha($dstImage, 255, 255, 255, 127);
                imagefilledrectangle($dstImage, 0, 0, $newWidth, $newHeight, $transparent);
            } elseif ($imageType == IMAGETYPE_GIF) {
                $transparentIndex = imagecolortransparent($srcImage);
                if ($transparentIndex >= 0) {
                    $transparentColor = imagecolorsforindex($srcImage, $transparentIndex);
                    $transparentIndexDst = imagecolorallocate($dstImage, $transparentColor['red'], $transparentColor['green'], $transparentColor['blue']);
                    imagefill($dstImage, 0, 0, $transparentIndexDst);
                    imagecolortransparent($dstImage, $transparentIndexDst);
                }
            }

            imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            // Save the resized image
            $outputFile = $tempDir . 'resized_' . $uploadedFiles['name'][$i];
            switch ($imageType) {
                case IMAGETYPE_JPEG:
                    imagejpeg($dstImage, $outputFile, 75); // Lowered the quality to 75
                    break;
                case IMAGETYPE_PNG:
                    imagepng($dstImage, $outputFile);
                    break;
                case IMAGETYPE_GIF:
                    imagegif($dstImage, $outputFile);
                    break;
            }

            // Add the output file to the list
            $outputFiles[] = [
                'url' => $outputFile,
                'name' => 'resized_' . $uploadedFiles['name'][$i]
            ];

            // Clean up
            imagedestroy($srcImage);
            imagedestroy($dstImage);

            // Delete the source file
            unlink($tempFile);
        }
    }

    echo json_encode($outputFiles);
} else {
    echo json_encode(['error' => 'No images provided.']);
}