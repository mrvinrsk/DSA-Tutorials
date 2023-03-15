<?php
require('../FPDF/fpdf.php');
require('../dsaPDF.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);


$kdnr = $_REQUEST['kd'];

$lineHeight = 12;

$kd = $_REQUEST['kd'];
$url = urldecode($_REQUEST['url']);


$pdf = new dsaPDF($url, "Securecheck | " . $kd);
$pdf->AddPage();

$pdf->SetFont("Merriweather Sans", '', 12);

if (isset($_REQUEST['list'])) {
    $list = $_REQUEST['list'];

    $txt = "Beim Securecheck zum Kunden " . $kd . " sind folgende Dinge aufgefallen, die noch erledigt werden müssen bevor du das Projekt umstellen kannst:<br> <br><b>TODO:</b><br>$list<br> <br> <br>Bitte beachte allgemein, dass Dinge wie SEO-Texte von alten HPs übernommen werden und vor dem Upload von der alten Seite ein Backup gemacht werden muss.";
} else {
    $txt = "<b>Herzlichen Glückwunsch!</b><br>Beim Securecheck zum Kunden <b>$kd</b> sind keine Unstimmigkeiten, die behoben werden müssten, gefunden worden. Das bedeutet, du kannst das Projekt guten Gewissens umstellen bzw. in den Endcheck schicken.";
}

$pdf->writeHTML($txt);
$pdf->Output();
