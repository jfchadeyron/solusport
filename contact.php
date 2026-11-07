<?php
/*
 * Formulaire de contact SoluSport.
 * Envoie le message par la fonction mail() de l’hébergement o2switch.
 * Compatible PHP 7.4 et versions suivantes.
 */

const DESTINATAIRE = 'contact@solusport.com';
// L’expéditeur doit appartenir à un domaine géré par le compte o2switch (SPF/DKIM).
const EXPEDITEUR = 'contact@solusport.com';
const SOLUTIONS = ['À définir ensemble', 'PresenSport', 'GestionSport', 'NotaSport', 'EquipSport', 'Plusieurs solutions'];
const ENVOIS_PAR_HEURE = 5;

date_default_timezone_set('Europe/Paris');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$enJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function repondre(int $code, bool $ok, string $texte): void
{
    global $enJson;
    http_response_code($code);
    if ($enJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'erreur' => $texte], JSON_UNESCAPED_UNICODE);
        exit;
    }
    // Réponse lisible quand le formulaire est envoyé sans JavaScript.
    header('Content-Type: text/html; charset=utf-8');
    $titre = $ok ? 'Message envoyé' : 'Message non envoyé';
    $texte = htmlspecialchars($texte, ENT_QUOTES, 'UTF-8');
    echo <<<HTML
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{$titre} | SoluSport</title>
<link rel="icon" href="assets/logos/favicon.png" type="image/png">
<link rel="stylesheet" href="assets/style.css">
</head>
<body><main class="wrap section">
<h1>{$titre}</h1>
<p>{$texte}</p>
<p><a class="button" href="index.html#contact">Revenir au site</a></p>
</main></body>
</html>
HTML;
    exit;
}

function champ(string $nom, int $longueurMax): string
{
    $valeur = trim((string) ($_POST[$nom] ?? ''));
    $valeur = str_replace("\0", '', $valeur);
    $longueur = function_exists('mb_strlen') ? mb_strlen($valeur, 'UTF-8') : strlen($valeur);
    return $longueur > $longueurMax ? '' : $valeur;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    repondre(405, false, 'Utilisez le formulaire de contact du site.');
}

// Refuse les envois depuis un autre site que celui qui héberge le formulaire.
$origine = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origine !== '' && strcasecmp((string) parse_url($origine, PHP_URL_HOST), (string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '')) !== 0) {
    repondre(403, false, 'Origine de la demande refusée.');
}

// Champ piège invisible : un robot le remplit, un visiteur ne le voit pas.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    repondre(200, true, 'Merci ! Votre message a bien été envoyé.');
}

$nom = champ('name', 100);
$club = champ('club', 150);
$email = champ('email', 180);
$solution = champ('solution', 60);
$message = champ('message', 3000);

foreach ([$nom, $club, $email, $solution] as $ligne) {
    if (preg_match('/[\r\n]/', $ligne)) {
        repondre(400, false, 'Le formulaire contient des caractères non autorisés.');
    }
}
if ($nom === '' || $club === '' || $message === '') {
    repondre(400, false, 'Merci de renseigner votre nom, votre association et votre projet.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repondre(400, false, 'Merci d’indiquer une adresse e-mail valide.');
}
if (!in_array($solution, SOLUTIONS, true)) {
    $solution = SOLUTIONS[0];
}

// Limite le nombre d’envois par adresse IP. Seule une empreinte de l’IP est conservée, une heure.
$maintenant = time();
$empreinte = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . __FILE__);
$journal = sys_get_temp_dir() . '/solusport-contact-' . $empreinte . '.json';
$envois = is_file($journal) ? json_decode((string) @file_get_contents($journal), true) : [];
$envois = array_values(array_filter(is_array($envois) ? $envois : [], function ($instant) use ($maintenant) {
    return is_int($instant) && $instant > $maintenant - 3600;
}));
if (count($envois) >= ENVOIS_PAR_HEURE) {
    repondre(429, false, 'Trop de messages envoyés depuis votre connexion. Réessayez dans une heure ou écrivez à ' . DESTINATAIRE . '.');
}

$site = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? 'solucheer.com');
$sujet = 'Projet ' . $solution . ' — ' . $club;
$corps = "Nouveau message reçu depuis le formulaire de contact de {$site}.\n\n"
    . "Nom : {$nom}\n"
    . "Association : {$club}\n"
    . "E-mail : {$email}\n"
    . "Solution : {$solution}\n\n"
    . "Projet :\n{$message}\n\n"
    . '-- ' . "\nEnvoyé le " . date('d/m/Y à H:i') . ". Répondez directement à ce message pour écrire à {$nom}.\n";

$sujetEncode = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($sujet, 'UTF-8', 'B', "\r\n")
    : '=?UTF-8?B?' . base64_encode($sujet) . '?=';
$entetes = implode("\r\n", [
    'From: =?UTF-8?B?' . base64_encode('Site SoluSport') . '?= <' . EXPEDITEUR . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    'X-Mailer: SoluSport',
]);

$corps = preg_replace('/\r\n?|\n/', "\r\n", $corps);

if (!mail(DESTINATAIRE, $sujetEncode, quoted_printable_encode($corps), $entetes, '-f' . EXPEDITEUR)) {
    error_log('SoluSport : échec de mail() pour le formulaire de contact.');
    repondre(500, false, 'L’envoi a échoué. Écrivez directement à ' . DESTINATAIRE . ' ou appelez le 07 56 82 21 12.');
}

$envois[] = $maintenant;
@file_put_contents($journal, json_encode($envois), LOCK_EX);
repondre(200, true, 'Merci ! Votre message a bien été envoyé à SoluSport. Une réponse vous sera apportée à l’adresse indiquée.');
