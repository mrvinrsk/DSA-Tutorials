<?php
require('../FPDF/fpdf.php');
require('../dsaPDF.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);


$kdnr = $_REQUEST['kd'];
$product = ucfirst($_REQUEST['website_type']);
$func = $_REQUEST['functionality'];
$other = $_REQUEST['other'];
$nav = $_REQUEST['navigation'];
$ownIdeas = $_REQUEST['ownIdeas'];
$logoGiven = $_REQUEST['logo'];
$logoLink = $_REQUEST['logoLink'];

$lineHeight = 12;

$kd = $_REQUEST['kd'];
$url = urldecode($_REQUEST['url']);


$pdf = new dsaPDF($url, "Briefing | " . $kd . ": " . $product);
$pdf->AddPage();

$pdf->SetFont("Merriweather Sans", '', 12);

$txt =
    "Im Rahmen des am " . date("d.m.y") . " um " . date("H:i") . " Uhr vollendeten Servicegesprächs wurden die folgenden Informationen, über das gewünschte Produkt " .
    "<b>$product</b> für den Kunden $kd erfasst:<br><br><br>" .
    "Der Kunde wünscht sich die folgenden Funktionalitäten:<br>" .
    $func .
    "<br><br>Außerdem sollen die folgenden Dinge beachtet werden:<br>" .
    $other . "<br><br><br>" .
    "Dabei soll es die Navigationspunkte <b>" . $nav . "</b> geben.<br><br><br>" .
    "Kundenwünsche zum Design:<br>" .
    (isset($ownIdeas) && strlen($ownIdeas) >= 1 ? $ownIdeas : "Keine Vorstellungen.") . "<br><br><br>" .
    "- " . (isset($logoGiven) && $logoGiven ? "Logo vorhanden" : "Kein Logo vorhanden.") . (isset($logoLink) && strlen($logoLink) >= 1 ? ": <a href='$logoLink'>" . $logoLink : "</a>") . "<br>";


$pdf->writeHTML($txt);

$pdf->Output();