<?php

class dsaPDF extends FPDF
{
    private $url;
    private $margin;
    private $title;
    private $fontsize;
    private $lineheight;

    public function __construct($url, $title = 'DSA Tutorials', $margin = 15)
    {
        parent::__construct();
        $this->url = $url;

        $this->AddFont("Merriweather", "B", "Merriweather-Bold.php");
        $this->AddFont("Merriweather Sans", "", "MerriweatherSans-Regular.php");
        $this->AddFont("Merriweather Sans", "B", "MerriweatherSans-Bold.php");

        $this->SetFont("Merriweather Sans", '');
        $this->margin = $margin;

        $this->SetMargins($margin, $margin);
        $this->SetFontSize(12);

        $this->title = $title;
    }

    // Header
    function Header()
    {
        $this->SetFillColor(204, 0, 0);
        $this->Rect(0, 0, $this->GetPageWidth(), 20, 'F');

        $this->SetFont('Merriweather', 'B', 18);
        $this->SetTextColor(245, 245, 245);
        $this->Cell(30, 0, $this->title);

        $this->Ln(15);
    }

    // Footer
    function Footer()
    {
        // 1.5cm vom unteren Rand entfernt
        $this->SetY(-20);
        $this->SetFont('Merriweather Sans', '', 8);

        $this->SetTextColor(220, 220, 220);

        $this->Cell(0, 5, iconv('UTF-8', 'windows-1252', "Erstellt am " . date('d.m.Y') . " um " . date('H:i') . " Uhr"));
        $this->Ln(4);
        $this->Cell(0, 5, iconv('UTF-8', 'windows-1252', "Generiert durch: " . $this->url), 0, 0, 'L');
        $this->Link($this->GetStringWidth("Generiert durch: ") + 17, $this->GetY(), $this->GetStringWidth($this->url), 5, $this->url);
        $this->Ln(4);
        $this->Cell(0, 5, iconv('UTF-8', 'windows-1252', "Entwickelt von Marvin Roßkothen"), 0, 0, 'L');

        $this->Image("../../images/logo.png", $this->getAvailableWidth() - 10, $this->GetPageHeight() - 18, 20);
    }

    /**
     * @return float|int|mixed
     */
    public function getAvailableWidth()
    {
        $pageWidth = $this->GetPageWidth();
        $leftMargin = $this->lMargin;
        $rightMargin = $this->rMargin;
        return $pageWidth - $leftMargin - $rightMargin;
    }

    public function getAvailableHeight()
    {
        $pageHeight = $this->GetPageHeight();
        $topMargin = $this->tMargin;
        $bottomMargin = $this->bMargin;
        return $pageHeight - $topMargin - $bottomMargin;
    }

    public function SetFontSize($size)
    {
        parent::SetFontSize($size);
        $this->fontsize = $size;
        $this->lineheight = (($this->fontsize / 100) * 51);
    }

    // Define a function for printing formatted text
    function writeHTML($html)
    {
        $elements = preg_split('#(<b>|</b>|<br>|<a href="(.+?)">|</a>)#i', $html, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

        foreach ($elements as $element) {
            if (strcasecmp($element, '<b>') == 0) {
                $this->SetFont('', 'B');
            } else if (strcasecmp($element, '</b>') == 0) {
                $this->SetFont('', '');
            } else if (strcasecmp($element, '<br>') == 0) {
                $this->Ln();
            } else if (preg_match('#^<a href="(.+?)">$#i', $element, $matches)) {
                $link = $matches[1];
                $this->SetTextColor(0, 0, 255); // Set link color, for example to blue
                $this->SetFont('', 'U'); // Set underline
                $linkStartPosition = $this->GetX(); // Store the starting X position of the link
            } else if (strcasecmp($element, '</a>') == 0) {
                $linkEndPosition = $this->GetX(); // Store the ending X position of the link
                $linkWidth = $linkEndPosition - $linkStartPosition; // Calculate the link width
                $this->Link($linkStartPosition, $this->GetY(), $linkWidth, $this->lineheight, $link); // Create the link
                $this->SetTextColor(0, 0, 0); // Reset text color
                $this->SetFont('', ''); // Remove underline
            } else {
                $this->Write($this->lineheight, iconv('UTF-8', 'windows-1252', $element));
                $this->SetFont('', '');
            }
        }
    }



    /**
     * @return float|int
     */
    public function getLineheight()
    {
        return $this->lineheight;
    }

}