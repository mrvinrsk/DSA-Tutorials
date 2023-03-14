<?php
require('../FPDF/fpdf.php');

$kdnr = $_REQUEST['kd'];

class PDF extends FPDF
{
    private $kd;
    private $url;

    public function __construct($kd, $url)
    {
        parent::__construct();
        $this->kd = $kd;
        $this->url = $url;
    }

    // Header
    function Header()
    {
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(204, 0, 0);
        $this->Cell(30, 10, 'Securecheck | ' . $this->kd);

        $this->Ln(10);
    }

    // Footer
    function Footer()
    {
        // 1.5cm vom unteren Rand entfernt
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);

        // Seitenzahl
        $this->Cell(0, 7, iconv('UTF-8', 'windows-1252', "Generiert durch: " . $this->url), 0, 0, 'L');
        $this->Link($this->GetStringWidth("Generiert durch: ") + 17, $this->GetY(), $this->GetStringWidth($this->url), 5, $this->url);
        $this->Ln(5);
        $this->Cell(0, 7, iconv('UTF-8', 'windows-1252', "Entwickelt von Marvin Roßkothen"), 0, 0, 'L');
    }
}


$lineHeight = 12;

$kd = $_REQUEST['kd'];
$url = urldecode($_REQUEST['url']);
$list = $_REQUEST['list'];

$pdf = new PDF($kd, $url);
$pdf->SetMargins(15, 15);
$pdf->AddPage();

$pageWidth = $pdf->GetPageWidth();
$leftMargin = $pdf->lMargin;
$rightMargin = $pdf->rMargin;
$availableWidth = $pageWidth - $leftMargin - $rightMargin;

$messages = array(
    "Beim Securecheck zum Kunden " . $kd . " sind folgende Dinge aufgefallen, die noch erledigt werden müssen bevor du das Projekt umstellen kannst:",
    "",
    "!b!TODO:",
    $list,
    "",
    "Bitte beachte allgemein, dass Dinge wie SEO-Texte von alten HPs übernommen werden und vor dem Upload von der alten Seite ein Backup gemacht werden muss.",
    "",
    ""
);

$pdf->SetFont('Arial', '', 12);
for ($i = 0; $i < sizeof($messages); $i++) {
    $string = $messages[$i];
    if(substr($string, 0, 3) == '!b!') {
        $string = substr($string, 3);
        $pdf->SetFont('Arial', 'B');
    }

    $pdf->MultiCell($availableWidth, $lineHeight / 2.25, iconv('UTF-8', 'windows-1252', $string)); // iconv bewirkt, dass alle Nachrichten in UTF-8 ausgegeben werden (mit ä, ö, ü, usw.)
    $pdf->SetFont('Arial', '');
}

$pdf->Output();
