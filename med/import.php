<?

require("../lib/main.inc.php");
$meds = "Cisapride
Valproicacid
Salicylicacid
Diazepam
Sudoxicam
Glyburide
Gallopamil
Mexiletine
Nefazodone
Naproxen
Lamotrigine
Tolmesoxide
Disulfiram
Torasemide
Metoprolol
Naloxone
Terazosin
Sulindac
Sultopride
Topiramate
Tolbutamide
Propiverine
Digoxin
Cimetidine
Furosemide
Metformin
Rimiterol
Ascorbicacid
Fosfomycin
Fosfidomycin
k-strophanthoside
Ouabain 
Kanamycin
Lactulose
Camazepam
Indomethacin
Levonorgestrel
Tenoxicam
Theophylline
Oxatomide
Desipramine
Fenclofenac
Imipramine
Lormetazepam
Diclofenac
Granisetron
Testosterone
Caffeine
Corticosterone
Ethinylestradiol
Isoxicam
Lornoxicam
Nicotine
Ondansetron
Piroxicam
Verapamil
Progesterone
Stavudine
Toremifene
Cyproteroneacetate
Cicaprost
Aminopyrine
Nordiazepam
Carfecillin
Prednisolone
Propanolol
Viloxazine
Warfarin
Atropine
Minoxidil
Clofibrate
Trimethoprim
Venlafaxine
Antipyrine
Bumetanide
Trapidil
Fluconazole
Sotalol
Codeine
Flumazenil
Ibuprofen
Labetalol
Oxprenolol
Practolol
Timolol
Alprenolol
Amrinone
Ketoprofen
Hydrocortisone
Betaxolol
Ketorolac
Meloxicam
Phenytoin
Amphetamine
Chloramphenicol
Felbamate
Nizatidine
Alprazolam
Tramadol
Nisoldipine
Oxazepam
Tenidap
Dihydrocodeine
Felodipine
Nitrendipine
Saccharin
Moxonidine
Bupropion
Pindolol
Lamivudine
Morphine
Lansoprazole
Oxifedrine
Captopril
Bromazepam
Acetylsalicylicacid
Sorivudine
Methylprednisolone
Mifobate
Flecainide
Quinidine
Piroximone
Acebutolol
Ethambutol
Acetaminophen
Dexamethasone
Guanabenz
Isoniazid
Omeprazole
Methadone
Famciclovir
Metolazone
Fenoterol
Nadolol
Atenolol
Sulpiride
Metaproterenol
Famotidine
Foscarnet
Cidofovir
Isradipine
Terbutaline
Reproterol
Lincomycin
Streptomycin
Fluvastatin
Urapidil
Propylthiouracil
Recainam
Cycloserine
Hydrochlorothiazide
Pirbuterol
Sumatriptan
Amiloride
Mannitol
Ganciclovir
Neomycin
Phenglutarimide
Bornaprine
Scopolamine
Ziprasidone
Guanoxan
Netivudine
Cefadroxil
Ofloxacin
Pefloxacin
Cephalexin
Loracarbef
Glycine
Amoxicillin
Tiagabine
Telmisartan
Trovafloxacin
Acrivastine
Nicotinicacid
Levodopa
Cefatrizine
Ampicillin
Vigabatrin
Tranexamicacid
Eflornithine
Methyldopa
Ceftriaxone
Distigminebromide
Zidovudine
Ximoprofen
Clonidine
Viomycin
Ceftizoxime
Capreomycin
AAFC
Bretvliumtosylate
Spironolactone
Etoposide
Cefuroximeaxetil
Azithromycin
Fosinopril
Pravastatin
Cyclosporin
Bromocriptine
Doxorubicin
Cefuroxime
Sulfasalazine
Benazepril
Lisinopril
Enalaprilat
AmphotericinB
Aztreonam
Ranitidine
Chlorothiazide
Acyclovir
Norfloxacin
Methotrexate
Gabapentin
Prazosin
Olsalazine
Ciprofloxacin
Ribavirin
Pafenolol
Azosemide
Xamoterol
Enalapril
Phenoxymethylpenicillin
Gliclazide
Benzylpenicillin
Thiacetazone
Lovastatin
Chromolynsodium
Erythromycin
"; 

$meds = explode("\n", $meds);

foreach($meds as $med){
	echo $med . "<br/>";
	//insert("med",array("generic"=>$med));
}
?>