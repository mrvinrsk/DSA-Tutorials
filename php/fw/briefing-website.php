<?php
require('../FPDF/fpdf.php');
require('../dsaPDF.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);


$kdnr = $_REQUEST['kd'];
$product = ucfirst($_REQUEST['website_type']);
$func = $_REQUEST['functionality'];

$lineHeight = 12;

$kd = $_REQUEST['kd'];
$url = urldecode($_REQUEST['url']);


$pdf = new dsaPDF($url, "Briefing | " . $kd . ": " . $product);
$pdf->AddPage();

$pdf->SetFont("Merriweather Sans", '', 12);

$txt =
    "Im Rahmen des am " . date("d.m.y") . " um " . date("H:i") . " Uhr vollendeten Servicegesprächs wurden die folgenden Informationen, über das gewünschte Produkt " .
    "<b>$product</b> für den Kunden $kd erfasst:<br><br>" .
    "Der Kunde wünscht sich die folgenden Funktionalitäten:<br>" .
    $func;


$pdf->writeHTML($txt);

$pdf->Output();