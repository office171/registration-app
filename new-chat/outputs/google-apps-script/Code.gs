const SHEET_NAME = "Registrations";
const ROOT_DRIVE_FOLDER_NAME = 'רישום תשפ"ז';
const ROOT_DRIVE_FOLDER_ID = "1Yt_s52U3M76rV-ca997vBhEJEHY4MKql";
const STUDENT_DETAILS_FOLDER_NAME = "פרטי הבחורים";
const PHOTO_ARCHIVE_FOLDER_NAME = 'תמונות תשפ"ז';
const START_STUDENT_NUMBER = 7000;
const REMOVED_HEADERS = ["כל הקבצים"];
const MAX_FILES_PER_SUBMISSION = 20;
const MAX_SINGLE_FILE_BASE64_CHARS = 12 * 1024 * 1024;
const MAX_TOTAL_FILE_BASE64_CHARS = 35 * 1024 * 1024;
const SUBMISSION_COOLDOWN_SECONDS = 5 * 60;
const MIN_FORM_FILL_SECONDS = 20;
const MAX_FORM_AGE_HOURS = 24;
const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif"
];

// Optional: put Drive file IDs here to show the logos at the top of each signed PDF.
const LOGO_FILE_IDS = {
  hebrew: "1ptsFTUdmkNN8lMm-48LNNBX9dm78KWOp",
  english: "1NNXmThjVv7enfIL0G7SBMKHIT7CDUP5a"
};

const TEMPLATE_FILE_IDS = {
  f1: "1_Hfsnj3uaLS1t_zie0cZubuLfXLDZRY3LucjSQLjQDE",
  f1Slides: "1BWh2etrJ0tMs17g0qPRjr2Q2cYW_D31fmj9NqEcujx8"
};

const SCRIPT_VERSION = "spam-protection-2026-07-09-01";

const FILE_FIELD_LABELS = {
  student_photo: "תמונת תלמיד",
  passport_document: "צילום דרכון",
  discount_documents: "מסמכים לבקשת הנחה",
  health_document: "מסמכים רפואיים",

  // Backward compatibility for older form versions.
  passport: "צילום דרכון",
  id_document: "צילום תעודת זהות",
  visa_document: "מסמך ויזה",
  ticket_document: "כרטיס טיסה"
};

const SIGNED_DOCUMENTS = [
  {
    key: "visa",
    signatureFieldId: "student_visa_signature",
    title: "חתימה על כללי ויזת F-1",
    fileLabel: "קובץ חתימה - ויזת F-1",
    sheetHeader: "קובץ חתימה - ויזת F-1",
    agreements: [
      "ידוע לי כי אישור הלימודים (טופס ה-I-20) מונפק על ידי מוסד הלימודים מכון חנה, וכי מטרת הגעתי לארצות הברית היא לצורך לימודים במוסד זה בלבד, ולא לכל מטרה אחרת.",
      "ידוע לי כי קבלת מעמד הסטודנט והמשך שמירתו מותנים בהשתתפות סדירה ומלאה בכל תוכניות הלימוד, השיעורים והפעילויות הנדרשות על ידי המוסד. היעדרויות, אי-עמידה בדרישות הלימוד או אי-שמירה על נהלי המוסד עלולים להביא לפגיעה במעמד הסטודנט, לרבות ביטול אישור הלימודים, בהתאם לדין ולהוראות המוסד.",
      "ידוע לי כי כל יציאה מהעיר, מהמדינה או מחוץ לארצות הברית מחייבת קבלת אישור מראש מהמשרד, לאחר מסירת פרטי הנסיעה והמועדים המתוכננים.",
      "ידוע לי כי בהתאם לתנאי ויזת הסטודנט, חל עליי איסור לעבוד במהלך שנת הלימודים. ידוע לי כי עבודה בניגוד לתנאי הוויזה מהווה הפרה של מעמד הסטודנט, ועלולה להביא לביטול המעמד ולהשלכות נוספות על פי חוק.",
      "ידוע לי כי השתתפותי בתוכנית הלימודים מותנית במגורים בפנימיות הישיבה במשך כל תקופת הלימודים.",
      "אני מאשר כי קראתי בעיון את כל האמור לעיל, הבנתי את משמעותו, ואני מתחייב לפעול בהתאם לכל הנהלים וההוראות של מכון חנה ולכל דרישות רשויות ההגירה של ארצות הברית."
    ]
  },
  {
    key: "dormitory",
    signatureFieldId: "dormitory_rules_signature",
    title: "חתימה על כללי הפנימייה",
    fileLabel: "קובץ חתימה - כללי הפנימייה",
    sheetHeader: "קובץ חתימה - פנימייה",
    agreements: [
      "אני מאשר כי קראתי את כללי הפנימייה, ואני מתחייב לפעול על פיהם במשך כל תקופת שהותי במסגרת תלמידי התמימים.",
      "אני מתחייב לשהות בפנימייה בזמני השינה והקימה, בהתאם לנהלים ולזמנים שייקבעו על ידי הנהלת הישיבה.",
      "אני מתחייב להישמע להוראות הנהלת הישיבה, מנהל הפנימיות והמדריכים.",
      "אני מתחייב לשמור על ניקיון החדר, רכוש הפנימייה והשימוש התקין במטבחים ובמתקני הפנימייה.",
      "אני מתחייב שלא להלין אורחים בפנימייה, שלא לעשן בתחומי הפנימייה, ולהשתמש במכשירים אלקטרוניים בהתאם לנהלי הישיבה בלבד.",
      "אני מתחייב ומאשר כי ידוע לי שהפרת כללי הפנימייה או הוראות הנהלת הישיבה עלולה להביא לנקיטת צעדים משמעתיים, לרבות קנסות, העברה בין חדרים או שלילת הזכאות למקום לינה."
    ]
  },
  {
    key: "health",
    signatureFieldId: "health_signature",
    title: "חתימה על שאלון רפואי",
    fileLabel: "קובץ חתימה - שאלון רפואי",
    sheetHeader: "קובץ חתימה - בריאות",
    intro: "פרטים רפואיים נוספים שיופיעו בראש המסמך יתווספו לפי הנוסח הסופי שייקבע.",
    agreements: [
      "אני מאשר שכל המידע שמסרתי נכון ומדוייק.",
      "אם יחול שינוי משמעותי במצבו הרפואי של התלמיד לאחר מילוי הטופס, יש לעדכן את הנהלת הישיבה בהקדם."
    ]
  },
  {
    key: "media",
    signatureFieldId: "media_signature",
    title: "חתימה על אישור שימוש בתמונות ובסרטונים",
    fileLabel: "קובץ חתימה - שימוש בתמונות",
    sheetHeader: "קובץ חתימה - שימוש בתמונות",
    intro: "במהלך שנת הלימודים והפעילויות השונות של תוכנית תלמידי התמימים, אנו מצלמים תמונות וסרטונים. חומרים אלו עשויים לשמש את מכון חנה לצורכי תיעוד, פרסום וקידום פעילותו, לרבות באתר האינטרנט, ברשתות החברתיות, בפרסומים ובחומרי הסברה.",
    optionsFromPayloadField: "media_permission",
    options: [
      "אני מאשר למכון חנה להשתמש בתמונות ובסרטונים בהם אני מופיע.",
      "איני מאשר למכון חנה להשתמש בתמונות ובסרטונים שבהם אני מופיע. ידוע לי כי באחריותי להשתדל, ככל האפשר, שלא להופיע בתמונות ובסרטונים המצולמים במסגרת פעילות המכון."
    ]
  }
];

const HEADERS = [
  "תאריך שליחה",
  "מספר פנימי",
  "סטטוס",
  "סוג הרשמה",
  "תיקיית תלמיד בדרייב",

  "שם פרטי בעברית",
  "שם משפחה בעברית",
  "שם מלא בעברית",
  "שם פרטי באנגלית",
  "שם משפחה באנגלית",
  "שם מלא באנגלית",
  "תאריך לידה עברי",
  "תאריך לידה לועזי",
  "עיר לידה",
  "מדינת לידה",
  "מיקוד מקום לידה",
  "שנת קבוצה",
  "ישיבה לפני הקבוצה",
  "מקום אחרי הקבוצה",
  "ישיבה תשפ\"ו",
  "ישיבה תשפ\"ה",
  "ישיבה תשפ\"ד",
  "אימייל תלמיד",
  "טלפון תלמיד",
  "אזרחויות",
  "אזרחות אחרת",
  "מספר זהות ישראלי",
  "מספר דרכון ישראלי",
  "מספר דרכון אמריקאי",
  "מספר Social Security",
  "מספר דרכון צרפתי",
  "מספר דרכון אחר",
  "ספר לנו על עצמך",
  "תמונת תלמיד",
  "צילום דרכון",

  "אשרת שהייה",
  "אשרת שהייה אחרת",
  "זקוק לויזת סטודנט",
  "הייתה ויזת F-1 בקבוצה",
  "ויזת F-1 עדיין בתוקף",
  "תוקף ויזת F-1",
  "אישור כללי ויזת סטודנט",
  "חתימת ויזת סטודנט",
  "סטטוס כרטיס הגעה",
  "תאריך הגעה",
  "יש כרטיס טיסה",
  "משך לימודים",

  "שם האב",
  "טלפון האב",
  "אימייל האב",
  "שם האם",
  "טלפון האם",
  "אימייל האם",
  "הורים גרים יחד",
  "רחוב",
  "עיר",
  "מדינה",
  "מיקוד",
  "למי לשלוח תשובת רישום",
  "כתובת אימייל למענה",

  "סטטוס דמי הרשמה",
  "מספר תשלום Stripe",
  "סכום דמי הרשמה בדולר",
  "זמן תשלום דמי הרשמה",

  "סוג בקשת הנחה",
  "מספר ילדים במשפחה",
  "מספר ילדים במוסדות בתשלום",
  "עיסוק האב",
  "עיסוק האם",
  "שכר לימוד שנה שעברה בשקלים",
  "נסיבות כלכליות",
  "נימוק בקשת הנחה",
  "שכר לימוד חודשי מבוקש בדולר",
  "מסמכים לבקשת הנחה",

  "אישור תנאי פיקדון",
  "אישור כללי הפנימייה",
  "התחייבות לימודים ופעילויות",
  "התחייבות זמני פנימייה",
  "התחייבות להוראות הצוות",
  "התחייבות ניקיון ורכוש",
  "התחייבות הגבלות פנימייה",
  "ידיעה על צעדים משמעתיים",
  "חתימת פנימייה",

  "איש קשר חירום",
  "טלפון חירום",
  "קרבה לאיש קשר חירום",
  "משקל",
  "גובה",
  "תאריך חיסון טטנוס אחרון",
  "יש מידע רפואי מיוחד",
  "סיכום מידע רפואי",
  "דרישות תזונתיות",
  "הפרעת אכילה",
  "טיפול פסיכולוגי",
  "מחלה נפשית או רגשית",
  "אלרגיות",
  "אסתמה",
  "אקזמה או סרפדת",
  "שחפת",
  "אפילפסיה",
  "סוכרת",
  "מערכת העיכול",
  "מחלה משמעותית אחרת",
  "תרופות בשלוש השנים האחרונות",
  "עיניים",
  "אוזניים",
  "אף",
  "פה וגרון",
  "עור",
  "לב",
  "ריאות",
  "מערכת העצבים",
  "אורתופדיה",
  "דיבור",
  "אשפוזים או ניתוחים",
  "מגבלה פיזית",
  "תרופות כיום",
  "אלרגיה לתרופות",
  "מידע רפואי נוסף",
  "אישור נכונות מידע רפואי",
  "חתימת בריאות",
  "מסמכים רפואיים",

  "אישור שימוש בתמונות",
  "נוסח אישור שימוש בתמונות",
  "חתימת שימוש בתמונות",
  "קובץ חתימה - ויזת F-1",
  "קובץ חתימה - פנימייה",
  "קובץ חתימה - בריאות",
  "קובץ חתימה - שימוש בתמונות",
  "נתונים נוספים"
];

const FIELD_TO_HEADER = {
  status: "סטטוס",
  kind: "סוג הרשמה",

  student_first_name_he: "שם פרטי בעברית",
  student_last_name_he: "שם משפחה בעברית",
  student_first_name_en: "שם פרטי באנגלית",
  student_last_name_en: "שם משפחה באנגלית",
  birth_date_he: "תאריך לידה עברי",
  birth_date: "תאריך לידה לועזי",
  birth_city: "עיר לידה",
  birth_country: "מדינת לידה",
  birth_zip: "מיקוד מקום לידה",
  student_group_year: "שנת קבוצה",
  yeshiva_before_group: "ישיבה לפני הקבוצה",
  yeshiva_after_group: "מקום אחרי הקבוצה",
  yeshiva_5786: "ישיבה תשפ\"ו",
  yeshiva_5785: "ישיבה תשפ\"ה",
  yeshiva_5784: "ישיבה תשפ\"ד",
  student_email: "אימייל תלמיד",
  student_phone: "טלפון תלמיד",
  citizenships: "אזרחויות",
  citizenship_other: "אזרחות אחרת",
  israeli_id_number: "מספר זהות ישראלי",
  israeli_passport_number: "מספר דרכון ישראלי",
  us_passport_number: "מספר דרכון אמריקאי",
  us_social_security_number: "מספר Social Security",
  french_passport_number: "מספר דרכון צרפתי",
  other_passport_number: "מספר דרכון אחר",
  student_about: "ספר לנו על עצמך",

  visa: "אשרת שהייה",
  visa_other: "אשרת שהייה אחרת",
  needs_student_visa: "זקוק לויזת סטודנט",
  prior_f1_visa_during_group: "הייתה ויזת F-1 בקבוצה",
  prior_f1_visa_valid: "ויזת F-1 עדיין בתוקף",
  prior_f1_visa_expiration: "תוקף ויזת F-1",
  student_visa_rules_accepted: "אישור כללי ויזת סטודנט",
  student_visa_signature_signed_at: "חתימת ויזת סטודנט",
  arrival_ticket_status: "סטטוס כרטיס הגעה",
  arrival_date: "תאריך הגעה",
  has_ticket: "יש כרטיס טיסה",
  study_duration: "משך לימודים",

  father_name: "שם האב",
  father_phone: "טלפון האב",
  father_email: "אימייל האב",
  mother_name: "שם האם",
  mother_phone: "טלפון האם",
  mother_email: "אימייל האם",
  parents_live_together: "הורים גרים יחד",
  parents_street: "רחוב",
  parents_city: "עיר",
  parents_state: "מדינה",
  parents_zip: "מיקוד",
  response_recipient: "למי לשלוח תשובת רישום",
  parent_response_email: "כתובת אימייל למענה",

  registration_payment_status: "סטטוס דמי הרשמה",
  registration_payment_session_id: "מספר תשלום Stripe",
  registration_payment_amount_usd: "סכום דמי הרשמה בדולר",
  registration_payment_paid_at: "זמן תשלום דמי הרשמה",

  discount_request_type: "סוג בקשת הנחה",
  family_children_count: "מספר ילדים במשפחה",
  children_with_tuition_count: "מספר ילדים במוסדות בתשלום",
  father_occupation: "עיסוק האב",
  mother_occupation: "עיסוק האם",
  last_year_tuition_ils: "שכר לימוד שנה שעברה בשקלים",
  discount_circumstances: "נסיבות כלכליות",
  discount_reason: "נימוק בקשת הנחה",
  requested_monthly_tuition_usd: "שכר לימוד חודשי מבוקש בדולר",

  deposit_terms_accepted: "אישור תנאי פיקדון",
  dormitory_rules_accepted: "אישור כללי הפנימייה",
  dormitory_commitment_study: "התחייבות לימודים ופעילויות",
  dormitory_commitment_presence: "התחייבות זמני פנימייה",
  dormitory_commitment_staff: "התחייבות להוראות הצוות",
  dormitory_commitment_cleanliness: "התחייבות ניקיון ורכוש",
  dormitory_commitment_restrictions: "התחייבות הגבלות פנימייה",
  dormitory_commitment_discipline: "ידיעה על צעדים משמעתיים",
  dormitory_rules_signature_signed_at: "חתימת פנימייה",

  emergency_name: "איש קשר חירום",
  emergency_phone: "טלפון חירום",
  emergency_relation: "קרבה לאיש קשר חירום",
  weight: "משקל",
  height: "גובה",
  last_tetanus_date: "תאריך חיסון טטנוס אחרון",
  has_health_note: "יש מידע רפואי מיוחד",
  health_note: "סיכום מידע רפואי",
  special_diet: "דרישות תזונתיות",
  eating_disorder: "הפרעת אכילה",
  psychological_treatment: "טיפול פסיכולוגי",
  emotional_condition: "מחלה נפשית או רגשית",
  allergies: "אלרגיות",
  asthma: "אסתמה",
  eczema_hives: "אקזמה או סרפדת",
  tuberculosis: "שחפת",
  epilepsy: "אפילפסיה",
  diabetes: "סוכרת",
  digestive_condition: "מערכת העיכול",
  significant_other_condition: "מחלה משמעותית אחרת",
  medications_last_three_years: "תרופות בשלוש השנים האחרונות",
  eye_findings: "עיניים",
  ear_findings: "אוזניים",
  nose_findings: "אף",
  mouth_throat_findings: "פה וגרון",
  skin_findings: "עור",
  heart_findings: "לב",
  lung_findings: "ריאות",
  nervous_system_findings: "מערכת העצבים",
  orthopedic_findings: "אורתופדיה",
  speech_findings: "דיבור",
  hospitalization_surgery: "אשפוזים או ניתוחים",
  physical_limitation: "מגבלה פיזית",
  regular_medication: "תרופות כיום",
  medication_allergy: "אלרגיה לתרופות",
  additional_health_info: "מידע רפואי נוסף",
  health_information_confirmed: "אישור נכונות מידע רפואי",
  health_signature_signed_at: "חתימת בריאות",

  media_permission: "אישור שימוש בתמונות",
  media_permission_text: "נוסח אישור שימוש בתמונות",
  media_signature_signed_at: "חתימת שימוש בתמונות"
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const payload = body.payload || {};
    const files = body.files || [];
    validateSubmission_(payload, files);
    enforceSubmissionCooldown_(payload);

    const studentNumber = nextStudentNumber_();
    const rootFolder = getRegistrationRootFolder_();
    const studentDetailsFolder = rootFolder;
    const studentFolder = studentDetailsFolder.createFolder(studentFolderName_(payload, studentNumber));
    const savedFiles = saveFiles_(studentFolder, payload, files);
    savedFiles.signatureDocuments = createSignatureDocuments_(studentFolder, payload, files, studentNumber);
    Object.keys(savedFiles.signatureDocuments).forEach(function(key) {
      const pdfFile = savedFiles.signatureDocuments[key];
      savedFiles.all.push({
        field_id: "signature_document_" + key,
        label: signatureDocumentLabel_(key),
        name: pdfFile.getName(),
        url: pdfFile.getUrl(),
        file: pdfFile
      });
    });

    duplicateStudentPhoto_(rootFolder, payload, savedFiles);

    const sheet = getOrCreateSheet_(SHEET_NAME);
    const headers = ensureHeaders_(sheet);
    appendRegistrationRow_(sheet, headers, studentNumber, payload, savedFiles, studentFolder);
    sendConfirmationEmail_(payload);

    return json_({
      ok: true,
      code_version: SCRIPT_VERSION,
      request_kind: payload.kind || "",
      registration_id: String(studentNumber),
      student_number: studentNumber
    });
  } catch (error) {
    console.error(error);
    return json_({
      ok: false,
      code_version: SCRIPT_VERSION,
      error: "השליחה נכשלה. יש לבדוק את הפרטים ולנסות שוב."
    });
  }
}

function setupRegistrationSheet() {
  const sheet = getOrCreateSheet_(SHEET_NAME);
  ensureHeaders_(sheet);
  return "Registration sheet is ready.";
}

function validateSubmission_(payload, files) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid payload");
  }
  if (!Array.isArray(files)) {
    throw new Error("Invalid files");
  }
  if (files.length > MAX_FILES_PER_SUBMISSION) {
    throw new Error("Too many files");
  }
  validateSpamSignals_(payload);

  const requiredTextFields = ["student_first_name_he", "student_last_name_he"];
  requiredTextFields.forEach(function(fieldId) {
    if (!String(payload[fieldId] || "").trim()) {
      throw new Error("Missing required field");
    }
  });

  const allowedPayloadFields = allowedPayloadFieldIds_();
  Object.keys(payload).forEach(function(fieldId) {
    if (!allowedPayloadFields[fieldId]) {
      throw new Error("Unexpected field");
    }
  });

  const allowedFileFields = allowedFileFieldIds_();
  let totalBase64Chars = 0;
  files.forEach(function(file) {
    if (!file || typeof file !== "object") throw new Error("Invalid file");
    if (!allowedFileFields[file.field_id]) throw new Error("Unexpected file field");
    if (!file.data || typeof file.data !== "string") throw new Error("Invalid file data");
    if (file.data.length > MAX_SINGLE_FILE_BASE64_CHARS) throw new Error("File too large");
    totalBase64Chars += file.data.length;
    if (totalBase64Chars > MAX_TOTAL_FILE_BASE64_CHARS) throw new Error("Submission too large");

    const mimeType = String(file.type || "").toLowerCase();
    if (isSignatureField_(file.field_id)) {
      if (mimeType !== "image/png") throw new Error("Invalid signature type");
    } else if (ALLOWED_UPLOAD_TYPES.indexOf(mimeType) === -1) {
      throw new Error("Invalid file type");
    }
  });
}

function validateSpamSignals_(payload) {
  if (String(payload._contact_company || "").trim()) {
    throw new Error("Spam detected");
  }

  const startedAt = new Date(payload._form_started_at || "");
  if (isNaN(startedAt.getTime())) {
    throw new Error("Missing form timing");
  }

  const ageSeconds = (Date.now() - startedAt.getTime()) / 1000;
  if (ageSeconds < MIN_FORM_FILL_SECONDS) {
    throw new Error("Submitted too quickly");
  }
  if (ageSeconds > MAX_FORM_AGE_HOURS * 60 * 60) {
    throw new Error("Form session expired");
  }
}

function enforceSubmissionCooldown_(payload) {
  const keyParts = [
    payload.student_first_name_he,
    payload.student_last_name_he,
    payload.student_email,
    payload.father_phone,
    payload.mother_phone
  ].map(function(value) {
    return String(value || "").trim().toLowerCase();
  }).filter(Boolean);

  if (!keyParts.length) return;
  const key = "registration-submit:" + Utilities.base64EncodeWebSafe(keyParts.join("|")).slice(0, 120);
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) {
    throw new Error("Duplicate submission");
  }
  cache.put(key, "1", SUBMISSION_COOLDOWN_SECONDS);
}

function allowedPayloadFieldIds_() {
  const fields = {
    status: true,
    kind: true,
    submitted_at: true,
    _form_started_at: true,
    _contact_company: true,
    yeshiva_name: true,
    yeshiva_other: true,
    yeshiva_5786_other: true,
    yeshiva_5785_other: true,
    yeshiva_5784_other: true
  };
  Object.keys(FIELD_TO_HEADER).forEach(function(fieldId) {
    fields[fieldId] = true;
  });
  return fields;
}

function allowedFileFieldIds_() {
  const fields = {};
  Object.keys(FILE_FIELD_LABELS).forEach(function(fieldId) {
    fields[fieldId] = true;
  });
  SIGNED_DOCUMENTS.forEach(function(documentConfig) {
    fields[documentConfig.signatureFieldId] = true;
  });
  return fields;
}

function testExportF1Template() {
  const payload = sampleTemplatePayload_();
  const testFolder = getOrCreateChildFolder_(getRegistrationRootFolder_(), "בדיקות PDF");
  const pdfFile = exportSlidesTemplateToPdf_({
    templateId: TEMPLATE_FILE_IDS.f1Slides,
    outputFolder: testFolder,
    outputName: "בדיקה - חתימה על כללי ויזת F-1 - " + studentHebrewName_(payload),
    replacements: templateReplacementMap_(payload, {
      date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy"),
      signatureText: "חתימה לדוגמה"
    })
  });
  return pdfFile.getUrl();
}

function appendRegistrationRow_(sheet, headers, studentNumber, payload, savedFiles, studentFolder) {
  const row = rowByHeader_(studentNumber, payload, savedFiles, studentFolder);
  const values = headers.map(function(header) {
    return row[header] || "";
  });
  sheet.appendRow(values);
}

function rowByHeader_(studentNumber, payload, savedFiles, studentFolder) {
  const row = {
    "תאריך שליחה": payload.submitted_at ? new Date(payload.submitted_at) : new Date(),
    "מספר פנימי": studentNumber,
    "תיקיית תלמיד בדרייב": studentFolder.getUrl(),
    "שם מלא בעברית": studentHebrewName_(payload),
    "שם מלא באנגלית": studentEnglishName_(payload),
    "תמונת תלמיד": fileLinksByField_(savedFiles, "student_photo"),
    "צילום דרכון": fileLinksByField_(savedFiles, "passport_document") || fileLinksByField_(savedFiles, "passport"),
    "מסמכים לבקשת הנחה": fileLinksByField_(savedFiles, "discount_documents"),
    "מסמכים רפואיים": fileLinksByField_(savedFiles, "health_document"),
    "קובץ חתימה - ויזת F-1": signatureDocumentUrl_(savedFiles, "visa"),
    "קובץ חתימה - פנימייה": signatureDocumentUrl_(savedFiles, "dormitory"),
    "קובץ חתימה - בריאות": signatureDocumentUrl_(savedFiles, "health"),
    "קובץ חתימה - שימוש בתמונות": signatureDocumentUrl_(savedFiles, "media")
  };

  Object.keys(FIELD_TO_HEADER).forEach(function(fieldId) {
    const header = FIELD_TO_HEADER[fieldId];
    row[header] = valueForSheet_(payload[fieldId]);
  });

  if (!row["ישיבה תשפ\"ו"] && payload.yeshiva_name) row["ישיבה תשפ\"ו"] = payload.yeshiva_name;

  row["נתונים נוספים"] = extraPayloadJson_(payload);
  return row;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaderRow_(sheet);
    return HEADERS.slice();
  }

  removeObsoleteHeaders_(sheet);

  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  HEADERS.forEach(function(header) {
    if (existing.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      existing.push(header);
    }
  });
  formatHeaderRow_(sheet);
  return existing;
}

function removeObsoleteHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) return;
  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (let index = existing.length - 1; index >= 0; index--) {
    if (REMOVED_HEADERS.indexOf(existing[index]) !== -1) {
      sheet.deleteColumn(index + 1);
    }
  }
}

function formatHeaderRow_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return;
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, lastColumn)
    .setFontWeight("bold")
    .setBackground("#f1f5f9")
    .setHorizontalAlignment("right");
}

function saveFiles_(studentFolder, payload, files) {
  const saved = {
    all: [],
    byField: {}
  };

  files.forEach(function(file) {
    if (isSignatureField_(file.field_id)) return;

    const label = fileLabel_(file.field_id);
    const bytes = Utilities.base64Decode(file.data);
    const blob = Utilities.newBlob(bytes, file.type || "application/octet-stream", hebrewFileName_(payload, label, file.name));
    const driveFile = studentFolder.createFile(blob);
    const record = {
      field_id: file.field_id,
      label: label,
      name: driveFile.getName(),
      url: driveFile.getUrl(),
      file: driveFile
    };

    saved.all.push(record);
    if (!saved.byField[file.field_id]) saved.byField[file.field_id] = [];
    saved.byField[file.field_id].push(record);
  });

  return saved;
}

function createSignatureDocuments_(studentFolder, payload, files, studentNumber) {
  const signaturesByField = {};
  files.forEach(function(file) {
    if (isSignatureField_(file.field_id)) signaturesByField[file.field_id] = file;
  });

  const created = {};
  SIGNED_DOCUMENTS.forEach(function(documentConfig, index) {
    const signatureFile = signaturesByField[documentConfig.signatureFieldId];
    if (!signatureFile) return;
    created[documentConfig.key] = saveSignatureImage_(studentFolder, payload, signatureFile, documentConfig, studentNumber, index + 1);
  });
  return created;
}

function saveSignatureImage_(studentFolder, payload, signatureFile, documentConfig, studentNumber, signatureNumber) {
  const bytes = Utilities.base64Decode(signatureFile.data);
  const fileName = safeDriveName_([
    studentNumber || "",
    signatureNumber || ""
  ].filter(Boolean).join(" - ")) + ".png";
  const blob = Utilities.newBlob(bytes, signatureFile.type || "image/png", fileName);
  return studentFolder.createFile(blob);
}

function createSingleSignatureDocument_(studentFolder, payload, signatureFile, documentConfig) {
  const submittedAt = payload.submitted_at ? new Date(payload.submitted_at) : new Date();
  const formattedDate = Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), "dd/MM/yyyy");
  const docName = safeDriveName_("מסמך חתום - " + documentConfig.title + " - " + studentHebrewName_(payload));
  const signatureDataUrl = "data:" + (signatureFile.type || "image/png") + ";base64," + signatureFile.data;
  if (documentConfig.key === "visa" && TEMPLATE_FILE_IDS.f1Slides) {
    return exportSlidesTemplateToPdf_({
      templateId: TEMPLATE_FILE_IDS.f1Slides,
      outputFolder: studentFolder,
      outputName: docName,
      replacements: templateReplacementMap_(payload, {
        date: formattedDate,
        signatureText: ""
      }),
      signatureDataUrl: signatureDataUrl,
      keepWorkingFile: payload.kind === "f1_signature_test"
    });
  }
  const html = signatureDocumentHtml_(payload, documentConfig, formattedDate, signatureDataUrl);
  const pdfBlob = Utilities
    .newBlob(html, "text/html", docName + ".html")
    .getAs(MimeType.PDF)
    .setName(docName + ".pdf");
  return studentFolder.createFile(pdfBlob);
}

function signatureDocumentHtml_(payload, documentConfig, formattedDate, signatureDataUrl) {
  return `
<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <style>
    @page { size: Letter; margin: 0.45in 0.5in; }
    body { margin: 0; color: #111827; font-family: Arial, sans-serif; direction: rtl; font-size: 12px; line-height: 1.45; }
    .logos { display: table; width: 100%; margin-bottom: 18px; }
    .logo-cell { display: table-cell; width: 50%; vertical-align: middle; }
    .logo-left { text-align: left; }
    .logo-right { text-align: right; }
    .logo { max-width: 120px; max-height: 58px; object-fit: contain; }
    h1 { margin: 0 0 18px; text-align: center; font-size: 20px; text-decoration: underline; }
    h2 { margin: 16px 0 8px; font-size: 15px; text-decoration: underline; }
    h3 { margin: 12px 0 6px; font-size: 13px; text-decoration: underline; }
    p { margin: 5px 0; }
    ol { margin: 0; padding-right: 22px; }
    li { margin-bottom: 7px; }
    table { border-collapse: collapse; width: 100%; margin: 6px 0 12px; }
    th, td { border: 1px solid #333; padding: 4px 6px; vertical-align: top; text-align: right; }
    th { background: #f3f4f6; font-weight: bold; }
    .medical td:nth-child(1), .medical td:nth-child(3) { width: 34%; font-weight: bold; background: #fafafa; }
    .medical td:nth-child(2), .medical td:nth-child(4) { width: 16%; }
    .line { border-bottom: 1px solid #111827; display: inline-block; min-width: 180px; padding: 0 4px 2px; }
    .long-line { min-width: 330px; }
    .signature-table { border: 0; margin-top: 24px; width: 54%; }
    .signature-table td { border: 0; text-align: center; padding: 3px 10px; }
    .signature-image { width: 150px; height: 48px; object-fit: contain; display: block; margin: 4px auto 0; }
    .option { margin: 7px 0; }
  </style>
</head>
<body>
  ${logosHtml_()}
  <h1>${htmlEscape_(documentConfig.title)}</h1>
  ${documentDetailsHtml_(payload, documentConfig)}
  ${documentConfig.intro ? `<p>${htmlEscape_(documentConfig.intro)}</p>` : ""}
  ${documentAgreementsHtml_(documentConfig, payload)}
  <table class="signature-table">
    <tr><td><span class="line">${htmlEscape_(formattedDate)}</span></td><td><span class="line">&nbsp;</span></td></tr>
    <tr><td>תאריך</td><td>חתימה</td></tr>
    <tr><td></td><td><img class="signature-image" width="150" height="48" src="${signatureDataUrl}" alt="חתימה"></td></tr>
  </table>
</body>
</html>`;
}

function logosHtml_() {
  return `
  <div class="logos">
    <div class="logo-cell logo-right">${logoImgHtml_(LOGO_FILE_IDS.hebrew)}</div>
    <div class="logo-cell logo-left">${logoImgHtml_(LOGO_FILE_IDS.english)}</div>
  </div>`;
}

function logoImgHtml_(fileId) {
  if (!fileId) return "";
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  return `<img class="logo" src="data:${blob.getContentType()};base64,${Utilities.base64Encode(blob.getBytes())}" alt="לוגו">`;
}

function documentDetailsHtml_(payload, documentConfig) {
  const baseDetails = `
    <p>שם התלמיד: <span class="line">${htmlEscape_(studentHebrewName_(payload))}</span> שם באנגלית: <span class="line">${htmlEscape_(studentEnglishName_(payload))}</span></p>
    ${payload.birth_date ? `<p>תאריך לידה: <span class="line">${htmlEscape_(payload.birth_date)}</span></p>` : ""}
    ${payload.student_phone ? `<p>טלפון: <span class="line">${htmlEscape_(payload.student_phone)}</span></p>` : ""}`;

  if (documentConfig.key !== "health") return baseDetails;

  const address = [payload.parents_street, payload.parents_city, payload.parents_state, payload.parents_zip].filter(Boolean).join(", ");
  const country = payload.birth_country || "";
  return `
    <p>שם התלמיד: <span class="line">${htmlEscape_(studentHebrewName_(payload))}</span> תאריך לידה: <span class="line">${htmlEscape_(payload.birth_date || "")}</span></p>
    <p>כתובת: <span class="line long-line">${htmlEscape_(address)}</span> מדינה: <span class="line">${htmlEscape_(country)}</span></p>
    <p>מספר טלפון: <span class="line long-line">${htmlEscape_(payload.student_phone || "")}</span></p>
    <hr>
    ${healthSheetHtml_(payload)}`;
}

function healthSheetHtml_(payload) {
  return `
    <h2>פרטי השאלון הרפואי</h2>
    ${healthRowsTableHtml_([
    ["איש קשר חירום", payload.emergency_name],
    ["טלפון חירום", payload.emergency_phone],
    ["קרבה לתלמיד", payload.emergency_relation],
    ["משקל", payload.weight],
    ["גובה", payload.height],
    ["תאריך חיסון טטנוס אחרון", payload.last_tetanus_date]
  ], false)}
    <h3>אלרגיות ורגישויות</h3>
    ${healthRowsTableHtml_([
    ["האם קיימות דרישות תזונתיות?", payload.special_diet],
    ["האם קיימות אלרגיות?", payload.allergies],
    ["האם קיימת אלרגיה לתרופות?", payload.medication_allergy],
    ["האם קיימת אסתמה?", payload.asthma],
    ["האם קיימת אקזמה או סרפדת?", payload.eczema_hives]
  ], true)}
    <h3>מחלות רקע</h3>
    ${healthRowsTableHtml_([
    ["האם כיום או בעבר הייתה שחפת?", payload.tuberculosis],
    ["האם כיום או בעבר הייתה אפילפסיה?", payload.epilepsy],
    ["האם קיימת סוכרת?", payload.diabetes],
    ["האם קיימת מחלה משמעותית אחרת?", payload.significant_other_condition]
  ], true)}
    <h3>בריאות נפשית</h3>
    ${healthRowsTableHtml_([
    ["האם כיום או בעבר הייתה הפרעת אכילה?", payload.eating_disorder],
    ["האם כיום או בעבר התקבל ייעוץ או טיפול פסיכולוגי?", payload.psychological_treatment],
    ["האם קיימת מחלה נפשית או רגשית?", payload.emotional_condition]
  ], true)}
    <h3>היסטוריה רפואית</h3>
    ${healthRowsTableHtml_([
    ["האם היו אשפוזים או ניתוחים?", payload.hospitalization_surgery],
    ["האם הנך נוטל כיום תרופות באופן קבוע?", payload.regular_medication],
    ["האם נטלת תרופות בקביעות בשלוש השנים האחרונות?", payload.medications_last_three_years]
  ], true)}
    <h3>ממצאים רפואיים לפי מערכות הגוף</h3>
    ${healthRowsTableHtml_([
    ["האם קיימת מחלה או בעיה משמעותית במערכת העיכול?", payload.digestive_condition],
    ["האם קיים ממצא רפואי משמעותי הקשור לעיניים?", payload.eye_findings],
    ["האם קיים ממצא רפואי משמעותי הקשור לאוזניים?", payload.ear_findings],
    ["האם קיים ממצא רפואי משמעותי הקשור לאף?", payload.nose_findings],
    ["האם קיים ממצא רפואי משמעותי הקשור לפה או לגרון?", payload.mouth_throat_findings],
    ["האם קיים ממצא רפואי משמעותי הקשור לעור?", payload.skin_findings],
    ["האם קיימת מחלת לב או ממצא רפואי משמעותי הקשור ללב?", payload.heart_findings],
    ["האם קיימת מחלת נשימה או ממצא רפואי משמעותי הקשור לריאות?", payload.lung_findings],
    ["האם קיים ממצא רפואי משמעותי הקשור למערכת העצבים?", payload.nervous_system_findings],
    ["האם קיים ממצא אורתופדי משמעותי?", payload.orthopedic_findings],
    ["האם קיים קושי בדיבור או ממצא רפואי משמעותי הקשור לדיבור?", payload.speech_findings],
    ["האם קיימת מגבלה פיזית?", payload.physical_limitation]
  ], true)}
    <h3>מידע נוסף</h3>
    ${healthRowsTableHtml_([
    ["מידע רפואי נוסף", payload.additional_health_info]
  ], false)}`;
}

function healthRowsTableHtml_(rows, showNoWhenEmpty) {
  const preparedRows = rows.map(function(row) {
    return [
      row[0],
      isEmpty_(row[1]) && showNoWhenEmpty ? "לא" : valueForSheet_(row[1])
    ];
  });

  let html = `<table class="medical"><tr><th>שאלה</th><th>תשובה</th><th>שאלה</th><th>תשובה</th></tr>`;
  for (let i = 0; i < preparedRows.length; i += 2) {
    const first = preparedRows[i];
    const second = preparedRows[i + 1] || ["", ""];
    html += `<tr><td>${htmlEscape_(first[0])}</td><td>${htmlEscape_(first[1] || "")}</td><td>${htmlEscape_(second[0])}</td><td>${htmlEscape_(second[1] || "")}</td></tr>`;
  }
  return html + `</table>`;
}

function appendLogos_(body) {
  const table = body.appendTable([["", ""]]);
  table.setBorderWidth(0);

  const hebrewCell = table.getCell(0, 0);
  const englishCell = table.getCell(0, 1);

  appendLogoToCell_(hebrewCell, LOGO_FILE_IDS.hebrew);
  appendLogoToCell_(englishCell, LOGO_FILE_IDS.english);

  if (!LOGO_FILE_IDS.hebrew && !LOGO_FILE_IDS.english) {
    hebrewCell.setText("מכון חנה");
    englishCell.setText("Machon Chana");
  }
}

function appendLogoToCell_(cell, fileId) {
  if (!fileId) return;
  const image = cell.appendImage(DriveApp.getFileById(fileId).getBlob());
  if (image.getWidth() > 130) image.setWidth(130);
}

function appendDocumentAgreements_(body, documentConfig, payload) {
  if (documentConfig.optionsFromPayloadField) {
    const selectedValue = payload[documentConfig.optionsFromPayloadField] || "";
    (documentConfig.options || []).forEach(function(option) {
      const marker = option === selectedValue ? "☑" : "☐";
      body.appendParagraph(marker + " " + option);
    });
    return;
  }

  (documentConfig.agreements || []).forEach(function(text, index) {
    body.appendParagraph((index + 1) + ". " + text);
  });
}

function documentAgreementsHtml_(documentConfig, payload) {
  if (documentConfig.optionsFromPayloadField) {
    const selectedValue = payload[documentConfig.optionsFromPayloadField] || "";
    return (documentConfig.options || [])
      .map(function(option) {
        const marker = option === selectedValue ? "☑" : "☐";
        return `<p class="option">${marker} ${htmlEscape_(option)}</p>`;
      })
      .join("");
  }

  const items = (documentConfig.agreements || [])
    .map(function(text) {
      return `<li>${htmlEscape_(text)}</li>`;
    })
    .join("");
  return `<ol>${items}</ol>`;
}

function htmlEscape_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function duplicateStudentPhoto_(rootFolder, payload, savedFiles) {
  const photos = savedFiles.byField.student_photo || [];
  if (!photos.length) return;

  const archiveRoot = getOrCreateChildFolder_(rootFolder, PHOTO_ARCHIVE_FOLDER_NAME);
  const selectedGroup = payload.student_group_year || 'קבוצה תשפ"ז';
  const folderName = selectedGroup === 'קבוצה תשפ"ז' ? safeDriveName_(payload.yeshiva_before_group || payload.yeshiva_name || "ללא ישיבה") : "בוגרים";
  const yeshivaFolder = getOrCreateChildFolder_(archiveRoot, folderName);
  const sourceBlob = photos[0].file.getBlob().setName(hebrewFileName_(payload, "תמונה", photos[0].name));
  const copy = yeshivaFolder.createFile(sourceBlob);
  photos[0].archive_url = copy.getUrl();
}

function sendConfirmationEmail_(payload) {
  const to = payload.parent_response_email || payload.student_email;
  if (!to) return;

  const studentName = studentHebrewName_(payload);
  const subject = "קיבלנו את טופס הרישום";
  const body =
    "שלום וברכה,\n\n" +
    "קיבלנו את טופס הרישום עבור " + studentName + ".\n\n" +
    "הצוות יעבור על הפרטים ויחזור אליכם בהקדם.\n\n" +
    "בברכה,\n" +
    "צוות הרישום";

  MailApp.sendEmail(to, subject, body);
}

function exportDocTemplateToPdf_(options) {
  const templateFile = DriveApp.getFileById(options.templateId);
  const workingFile = templateFile.makeCopy(options.outputName + " - working", options.outputFolder);
  const doc = DocumentApp.openById(workingFile.getId());
  const body = doc.getBody();

  if (options.signatureDataUrl) {
    replacePlaceholderWithImage_(body, "{{signature}}", options.signatureDataUrl, {
      maxWidth: 150,
      maxHeight: 48
    });
  }

  Object.keys(options.replacements || {}).forEach(function(placeholder) {
    body.replaceText(escapeForReplaceText_(placeholder), String(options.replacements[placeholder] || ""));
  });

  doc.saveAndClose();

  const pdfBlob = workingFile.getAs(MimeType.PDF).setName(options.outputName + ".pdf");
  const pdfFile = options.outputFolder.createFile(pdfBlob);
  workingFile.setTrashed(true);
  return pdfFile;
}

function exportSlidesTemplateToPdf_(options) {
  const templateFile = DriveApp.getFileById(options.templateId);
  const workingFile = templateFile.makeCopy(options.outputName + " - working", options.outputFolder);
  const presentation = SlidesApp.openById(workingFile.getId());
  const slides = presentation.getSlides();

  Object.keys(options.replacements || {}).forEach(function(placeholder) {
    if (placeholder === "{{signature}}") return;
    slides.forEach(function(slide) {
      slide.replaceAllText(placeholder, String(options.replacements[placeholder] || ""));
    });
  });

  if (options.signatureDataUrl) {
    replaceSlidesPlaceholderWithImage_(slides, "{{signature}}", options.signatureDataUrl, {
      left: 388,
      top: 705,
      width: 120,
      height: 34
    });
  } else {
    slides.forEach(function(slide) {
      slide.replaceAllText("{{signature}}", "");
    });
  }

  presentation.saveAndClose();

  const pdfBlob = workingFile.getAs(MimeType.PDF).setName(options.outputName + ".pdf");
  const pdfFile = options.outputFolder.createFile(pdfBlob);
  if (options.keepWorkingFile) {
    workingFile.setName(options.outputName + " - שקף עבודה");
    pdfFile.setDescription("Working Slides file: " + workingFile.getUrl());
  } else {
    workingFile.setTrashed(true);
  }
  return pdfFile;
}

function replaceSlidesPlaceholderWithImage_(slides, placeholder, dataUrl, fallbackBox) {
  const blob = dataUrlToBlob_(dataUrl, "signature.png");
  let inserted = false;

  slides.forEach(function(slide) {
    slide.getPageElements().forEach(function(element) {
      if (inserted || element.getPageElementType() !== SlidesApp.PageElementType.SHAPE) return;

      const shape = element.asShape();
      let text = "";
      try {
        text = shape.getText().asString();
      } catch (error) {
        return;
      }
      if (text.indexOf(placeholder) === -1) return;

      const box = {
        left: element.getLeft(),
        top: element.getTop(),
        width: element.getWidth(),
        height: element.getHeight()
      };
      element.remove();
      const image = slide.insertImage(blob);
      fitSlidesImageInBox_(image, box);
      inserted = true;
    });
  });

  if (inserted) return true;

  const firstSlide = slides[0];
  if (!firstSlide) return false;
  const image = firstSlide.insertImage(blob);
  fitSlidesImageInBox_(image, fallbackBox);
  return true;
}

function fitSlidesImageInBox_(image, box) {
  const originalWidth = image.getWidth();
  const originalHeight = image.getHeight();
  const scale = Math.min(box.width / originalWidth, box.height / originalHeight, 1);
  const width = Math.max(1, originalWidth * scale);
  const height = Math.max(1, originalHeight * scale);

  image.setWidth(width);
  image.setHeight(height);
  image.setLeft(box.left + ((box.width - width) / 2));
  image.setTop(box.top + ((box.height - height) / 2));
}

function replacePlaceholderWithImage_(body, placeholder, dataUrl, options) {
  const match = body.findText(escapeForReplaceText_(placeholder));
  if (!match) return false;

  const text = match.getElement().asText();
  const start = match.getStartOffset();
  const end = match.getEndOffsetInclusive();
  text.deleteText(start, end);

  const parent = text.getParent();
  const imageIndex = parent.getChildIndex(text) + 1;
  const blob = dataUrlToBlob_(dataUrl, "signature.png");
  const image = parent.insertInlineImage(imageIndex, blob);
  scaleInlineImage_(image, options.maxWidth || 150, options.maxHeight || 48);
  return true;
}

function dataUrlToBlob_(dataUrl, fileName) {
  const parts = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!parts) throw new Error("Invalid signature data URL");
  const bytes = Utilities.base64Decode(parts[2]);
  return Utilities.newBlob(bytes, parts[1], fileName);
}

function scaleInlineImage_(image, maxWidth, maxHeight) {
  const width = image.getWidth();
  const height = image.getHeight();
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  image.setWidth(Math.max(1, Math.round(width * scale)));
  image.setHeight(Math.max(1, Math.round(height * scale)));
}

function templateReplacementMap_(payload, options) {
  const date = options.date || "";
  return {
    "{{student_name_he}}": studentHebrewName_(payload),
    "{{student_name_en}}": studentEnglishName_(payload),
    "{{date}}": date,
    "{{signature}}": options.signatureText || "",
    "{{birth_date}}": payload.birth_date || "",
    "{{address}}": [payload.parents_street, payload.parents_city, payload.parents_state, payload.parents_zip].filter(Boolean).join(", "),
    "{{country}}": payload.birth_country || "",
    "{{student_phone}}": payload.student_phone || "",
    "{{media_option_approved}}": payload.media_permission === "אני מאשר למכון חנה להשתמש בתמונות ובסרטונים בהם אני מופיע." ? "☑" : "☐",
    "{{media_option_declined}}": payload.media_permission === "איני מאשר למכון חנה להשתמש בתמונות ובסרטונים שבהם אני מופיע. ידוע לי כי באחריותי להשתדל, ככל האפשר, שלא להופיע בתמונות ובסרטונים המצולמים במסגרת פעילות המכון." ? "☑" : "☐"
  };
}

function sampleTemplatePayload_() {
  return {
    student_first_name_he: "ישראל",
    student_last_name_he: "ישראלי",
    student_first_name_en: "Yisroel",
    student_last_name_en: "Israeli",
    birth_date: "2007-01-01",
    birth_country: "ארצות הברית",
    student_phone: "050-000-0000",
    parents_street: "770 Eastern Parkway",
    parents_city: "Brooklyn",
    parents_state: "NY",
    parents_zip: "11213",
    media_permission: "אני מאשר למכון חנה להשתמש בתמונות ובסרטונים בהם אני מופיע."
  };
}

function escapeForReplaceText_(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nextStudentNumber_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const properties = PropertiesService.getScriptProperties();
    const current = Number(properties.getProperty("NEXT_STUDENT_NUMBER") || START_STUDENT_NUMBER);
    properties.setProperty("NEXT_STUDENT_NUMBER", String(current + 1));
    return current;
  } finally {
    lock.releaseLock();
  }
}

function getRegistrationRootFolder_() {
  if (ROOT_DRIVE_FOLDER_ID) return DriveApp.getFolderById(ROOT_DRIVE_FOLDER_ID);
  return getOrCreateFolder_(ROOT_DRIVE_FOLDER_NAME);
}

function getOrCreateSheet_(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function getOrCreateFolder_(name) {
  const folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function getOrCreateChildFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function fileLinksByField_(savedFiles, fieldId) {
  const records = savedFiles.byField[fieldId] || [];
  return records.map(function(file) {
    return file.url;
  }).join("\n");
}

function allFileLinks_(files) {
  return files.map(function(file) {
    return file.label + ": " + file.url;
  }).join("\n");
}

function signatureDocumentUrl_(savedFiles, key) {
  const documents = savedFiles.signatureDocuments || {};
  return documents[key] ? documents[key].getUrl() : "";
}

function signatureDocumentUrls_(savedFiles) {
  const documents = savedFiles.signatureDocuments || {};
  const urls = {};
  Object.keys(documents).forEach(function(key) {
    urls[key] = documents[key].getUrl();
  });
  return urls;
}

function signatureDocumentLabel_(key) {
  const match = SIGNED_DOCUMENTS.filter(function(documentConfig) {
    return documentConfig.key === key;
  })[0];
  return match ? match.fileLabel : "קובץ חתימה";
}

function extraPayloadJson_(payload) {
  const known = {};
  Object.keys(FIELD_TO_HEADER).forEach(function(fieldId) {
    known[fieldId] = true;
  });
  known.status = true;
  known.kind = true;
  known.submitted_at = true;
  known.yeshiva_name = true;
  known.yeshiva_other = true;
  known.yeshiva_5786_other = true;
  known.yeshiva_5785_other = true;
  known.yeshiva_5784_other = true;

  const extra = {};
  Object.keys(payload).forEach(function(key) {
    if (!known[key] && !isEmpty_(payload[key])) extra[key] = payload[key];
  });
  return Object.keys(extra).length ? JSON.stringify(extra, null, 2) : "";
}

function isEmpty_(value) {
  if (value == null) return true;
  if (value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function valueForSheet_(value) {
  if (value === true) return "כן";
  if (value === false) return "לא";
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return value == null ? "" : value;
}

function studentFolderName_(payload, studentNumber) {
  const name = studentHebrewName_(payload);
  return safeDriveName_((studentNumber ? studentNumber + " - " : "") + (name || "תלמיד ללא שם"));
}

function studentHebrewName_(payload) {
  return `${payload.student_first_name_he || ""} ${payload.student_last_name_he || ""}`.trim();
}

function studentEnglishName_(payload) {
  return `${payload.student_first_name_en || ""} ${payload.student_last_name_en || ""}`.trim();
}

function fileLabel_(fieldId) {
  return FILE_FIELD_LABELS[fieldId] || fieldId;
}

function isSignatureField_(fieldId) {
  return SIGNED_DOCUMENTS.some(function(documentConfig) {
    return documentConfig.signatureFieldId === fieldId;
  });
}

function hebrewFileName_(payload, label, originalName) {
  const ext = fileExtension_(originalName);
  const base = `${studentHebrewName_(payload)} ${label}`.trim();
  return safeDriveName_(base || label) + ext;
}

function fileExtension_(name) {
  const match = String(name || "").match(/(\.[^.\s]+)$/);
  return match ? match[1] : "";
}

function safeDriveName_(value) {
  return String(value || "")
    .replace(/[\\/:*?"<>|#%\{\}\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
