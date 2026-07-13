(function () {
  const STORAGE_KEY = "kvutze-registration-draft-v1";
  const DEV_SKIP_REQUIRED_VALIDATION = false;
  const DEV_SKIP_PAYMENT_VALIDATION = isLocalPreview();
  const config = window.APP_CONFIG || {};
  const formStartedAt = new Date().toISOString();
  const PROGRAM_END_DATE = "2027-11-07";
  const DEFAULT_FULL_YEAR_START_DATE = "2026-08-27";
  const GROUP_5786_FULL_YEAR_START_DATE = "2026-10-01";
  const MIN_STUDY_START_DATE = "2026-08-27";
  const FIRST_REGULAR_TUITION_CHARGE_DATE = "2026-09-01";

  function isLocalPreview() {
    return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  }

  const yeshivaOptions = [
    "אור יהודה",
    "באר שבע",
    "בוכרים",
    "בית שמש",
    "דעת",
    "דרכי תמימים",
    "טבריה",
    "יצהר",
    "כפר חב\"ד",
    "מגדל העמק",
    "מכון ר\"נ",
    "מכון תורני טכנולוגי",
    "צפת",
    "קרית אתא",
    "קרית גת",
    "ראשון לציון",
    "רמת אביב",
    "תורת אמת",
    "אחר"
  ];
  const groupYearOptions = ["קבוצה תשפ\"ז", "קבוצה תשפ\"ו", "קבוצה תשפ\"ה", "קבוצה תשפ\"ד"];
  const defaultGroupYear = "קבוצה תשפ\"ז";
  const additionalDiscountOption = "אני מבקש הנחה נוספת בהתאם למצב הכלכלי";
  const discountFormFileUrl = "./discount-request.pdf";
  const groupYearMap = {
    "קבוצה תשפ\"ז": { before: "תשפ״ו", after: null },
    "קבוצה תשפ\"ו": { before: "תשפ״ה", after: null },
    "קבוצה תשפ\"ה": { before: "תשפ״ד", after: "תשפ״ו" },
    "קבוצה תשפ\"ד": { before: "תשפ״ג", after: "תשפ״ה" }
  };

  const steps = [
    {
      id: "intro",
      title: "רישום לתלמידי התמימים – תשפ\"ז",
      fields: [
        {
          id: "intro_message",
          type: "intro_text",
          title: "בסייעתא דשמיא",
          paragraphs: [
            "אנו שמחים לפתוח את הרישום לתוכנית תלמידי התמימים לשנת הלימודים תשפ\"ז.",
            "בטופס שלפניכם תוכלו למלא את כל פרטי ההרשמה. אנא הקפידו למלא את כל השדות בצורה מדויקת ומלאה, כדי שנוכל לטפל בבקשתכם בצורה הטובה ביותר.",
            "טופס ההרשמה כולל מספר שלבים ודורש פרטים רבים של הבחור וכן של ההורים.",
            "הפרטים נשמרים אוטומטית כטיוטה באותו דפדפן ובאותו מכשיר, וניתן גם ללחוץ על \"שמור טיוטה\" לאישור ידני. מטעמי אבטחת דפדפן, קבצים מצורפים אינם נשמרים בטיוטה ויש לצרף אותם מחדש אם חוזרים לטופס מאוחר יותר.",
            "בסיום מילוי הטופס תתבקשו לשלם דמי הרשמה בסך 10 דולר. ההרשמה תושלם רק לאחר ביצוע התשלום וקבלת אישור על שליחת הטופס.",
            "בהצלחה רבה ומופלגה."
          ],
          contactBox: {
            title: "לשאלות ועזרה במילוי הטופס ניתן לפנות למזכירות",
            intro: "בימים א'-ה', משעה 19:00 ועד לשעה 21:00.",
            items: [
              "טלפון: 03-7223149 שלוחה 1",
              "טלפון נוסף: 18647770770+",
              "דוא\"ל: reception@kvutze.org",
              "וואצאפ: 18647770770"
            ]
          },
          signature: ["יחי אדוננו מורנו ורבינו מלך המשיח לעולם ועד"]
        }
      ]
    },
    {
      id: "student",
      title: "פרטי תלמיד",
      fields: [
        { id: "student_name_section", type: "section", label: "שם התלמיד" },
        { id: "student_last_name_he", label: "שם משפחה בעברית", type: "text", required: true },
        { id: "student_first_name_he", label: "שם פרטי מלא בעברית", type: "text", required: true },
        {
          id: "student_last_name_en",
          label: "שם משפחה באנגלית",
          type: "text",
          required: true,
          hint: "יש לכתוב את השם בדיוק כפי שהוא מופיע בדרכון."
        },
        {
          id: "student_first_name_en",
          label: "שם פרטי באנגלית",
          type: "text",
          required: true,
          hint: "יש לכתוב את השם בדיוק כפי שהוא מופיע בדרכון."
        },
        { id: "birth_section", type: "section", label: "לידה" },
        {
          id: "birth_date_he",
          label: "תאריך לידה עברי",
          type: "text",
          required: true,
          hint: "יש לכתוב תאריך, חודש ושנה."
        },
        { id: "birth_date", label: "תאריך לידה לועזי", type: "date", required: true, minAge: 17, calendarOnly: true, reserveHintSpace: true },
        {
          id: "birth_city",
          label: "מקום הלידה - עיר",
          type: "text",
          required: true,
          autocomplete: "address-level2",
          layout: "full"
        },
        {
          id: "birth_country",
          label: "מקום הלידה - מדינה",
          type: "text",
          required: true,
          autocomplete: "country-name",
          layout: "full"
        },
        {
          id: "birth_zip",
          label: "מקום הלידה - מיקוד",
          type: "text",
          required: true,
          autocomplete: "postal-code",
          layout: "full"
        },
        { id: "yeshiva_section", type: "section", label: "שנת קבוצה ומקום לימודים" },
        {
          id: "student_group_year",
          label: "שנת קבוצה",
          type: "select",
          options: groupYearOptions,
          required: true,
          defaultValue: defaultGroupYear,
          layout: "wide"
        },
        {
          id: "yeshiva_5786",
          label: "מקום לימודים בישיבה גדולה בשנת תשפ״ו",
          dynamicLabel: { resolver: "yeshivaBeforeGroupLabel" },
          type: "select",
          options: yeshivaOptions,
          required: true,
          layout: "full"
        },
        {
          id: "yeshiva_5786_other",
          label: "שם הישיבה בשנת תשפ״ו",
          dynamicLabel: { resolver: "yeshivaBeforeGroupOtherLabel" },
          type: "text",
          required: true,
          layout: "full",
          showWhen: { field: "yeshiva_5786", equals: "אחר" }
        },
        {
          id: "same_yeshiva_3_years",
          label: "למדתי שם 3 שנים",
          type: "checkbox",
          checkboxText: "כן",
          layout: "full",
          showWhen: { field: "student_group_year", equals: defaultGroupYear }
        },
        {
          id: "yeshiva_5785",
          label: "מקום לימודים בישיבה גדולה בשנת תשפ״ה",
          dynamicLabel: { resolver: "yeshivaMiddleGroupLabel" },
          type: "select",
          options: yeshivaOptions,
          required: true,
          layout: "full",
          hideWhen: { field: "same_yeshiva_3_years", equals: true },
          showWhen: { field: "student_group_year", equals: defaultGroupYear }
        },
        {
          id: "yeshiva_5785_other",
          label: "שם הישיבה בשנת תשפ״ה",
          dynamicLabel: { resolver: "yeshivaMiddleGroupOtherLabel" },
          type: "text",
          required: true,
          layout: "full",
          showWhen: { field: "yeshiva_5785", equals: "אחר" },
          hideWhen: { field: "same_yeshiva_3_years", equals: true },
          showWhenIn: { field: "student_group_year", values: [defaultGroupYear] }
        },
        {
          id: "yeshiva_after_group_text",
          label: "איפה היית בשנה שאחרי הקבוצה שלך",
          dynamicLabel: { resolver: "yeshivaAfterGroupTextLabel" },
          type: "text",
          required: true,
          layout: "full",
          showWhenIn: { field: "student_group_year", values: ["קבוצה תשפ\"ה", "קבוצה תשפ\"ד"] }
        },
        {
          id: "yeshiva_5784",
          label: "מקום לימודים בישיבה גדולה בשנת תשפ״ד",
          type: "select",
          options: yeshivaOptions,
          required: true,
          layout: "full",
          hideWhen: { field: "same_yeshiva_3_years", equals: true },
          showWhen: { field: "student_group_year", equals: defaultGroupYear }
        },
        {
          id: "yeshiva_5784_other",
          label: "שם הישיבה בשנת תשפ״ד",
          type: "text",
          required: true,
          layout: "full",
          showWhen: { field: "yeshiva_5784", equals: "אחר" },
          hideWhen: { field: "same_yeshiva_3_years", equals: true },
          showWhenIn: { field: "student_group_year", values: [defaultGroupYear] }
        },
        { id: "student_email_section", type: "section", label: "אימייל התלמיד" },
        {
          id: "student_email",
          label: "כתובת אימייל של התלמיד",
          type: "text",
          required: true,
          emailOrNone: true,
          layout: "full",
          hint: "באם אין לך כתובת אימייל, יש לכתוב: אין לי."
        },
        {
          id: "student_email_confirm",
          label: "אימות כתובת האימייל",
          type: "text",
          required: true,
          matches: "student_email",
          emailOrNone: true,
          layout: "full",
          hint: "אם כתבת אין לי בשדה הקודם, יש לכתוב גם כאן: אין לי."
        },
        {
          id: "student_photo",
          label: "צרף תמונה עדכנית",
          type: "file",
          required: true,
          layout: "full"
        }
      ]
    },
    {
      id: "student_documents",
      title: "פרטי תלמיד",
      fields: [
        {
          id: "citizenships",
          label: "אזרחות",
          type: "checkbox_group",
          options: ["ישראל", "ארה״ב", "צרפת", "אחר"],
          required: true,
          hint: "באם יש כמה אזרחויות, נא לסמן את כולן.",
          inlineOtherField: {
            option: "אחר",
            fieldId: "citizenship_other",
            placeholder: "שם האזרחות"
          }
        },
        {
          id: "israeli_id_number",
          label: "מספר תעודת זהות ישראלית",
          type: "text",
          required: true,
          israeliId: true,
          layout: "pair",
          showWhen: { field: "citizenships", contains: "ישראל" }
        },
        {
          id: "israeli_passport_number",
          label: "מספר דרכון ישראלי",
          type: "text",
          required: true,
          layout: "pair",
          showWhen: { field: "citizenships", contains: "ישראל" }
        },
        {
          id: "us_passport_number",
          label: "מספר דרכון אמריקאי",
          type: "text",
          required: true,
          layout: "pair",
          showWhen: { field: "citizenships", contains: "ארה״ב" }
        },
        {
          id: "us_social_security_number",
          label: "מספר Social Security אמריקאי",
          type: "text",
          required: true,
          layout: "pair",
          showWhen: { field: "citizenships", contains: "ארה״ב" }
        },
        {
          id: "french_passport_number",
          label: "מספר דרכון צרפתי",
          type: "text",
          required: true,
          showWhen: { field: "citizenships", contains: "צרפת" }
        },
        {
          id: "other_passport_number",
          label: "מספר דרכון אחר",
          dynamicLabel: { prefix: "מספר דרכון", field: "citizenship_other", separator: " " },
          type: "text",
          required: true,
          hint: "אם יש כמה דרכונים, יש למלא כאן דרכון נוסף שאינו מופיע בשדות שלמעלה.",
          showWhen: { field: "citizenships", contains: "אחר" }
        },
        {
          id: "passport_document",
          label: "צרף תמונה של הדרכון",
          type: "file",
          required: true,
          hint: "יש לוודא שהדרכון בתוקף."
        },
        {
          id: "student_about",
          label: "ספר לנו קצת על עצמך",
          type: "textarea",
          required: true,
          hint: "יש לפרט תחומי עניין מיוחדים, כישורים, ידע, יכולות, תחביבים או עיסוקים נוספים."
        }
      ]
    },
    {
      id: "visa",
      title: "אשרת שהיה",
      fields: [
        {
          id: "arrival_ticket_status",
          label: "באיזה תאריך אתה מגיע?",
          type: "radio",
          options: ["אין לי עדיין כרטיס - אעדכן בהמשך", "יש לי כרטיס"],
          required: true
        },
        {
          id: "arrival_date",
          label: "תאריך הגעה / נחיתה בניו יורק",
          type: "date",
          required: true,
          showWhen: { field: "arrival_ticket_status", equals: "יש לי כרטיס" }
        },
        {
          id: "study_duration",
          label: "לכמה זמן הנך מגיע ללמוד?",
          type: "radio",
          options: ["שנה תמימה", "לא שנה תמימה"],
          required: true
        },
        {
          id: "study_start_date",
          label: "תאריך התחלת הלימודים",
          type: "date",
          required: true,
          calendarOnly: true,
          min: MIN_STUDY_START_DATE,
          visibleWhen: () => shouldAskStudyStartDate()
        },
        {
          id: "study_end_date",
          label: "תאריך סיום הלימודים",
          type: "date",
          required: true,
          calendarOnly: true,
          visibleWhen: () => shouldAskStudyEndDate()
        },
        {
          id: "student_visa_needed",
          label: "האם אתה מעוניין וזקוק לויזת סטודנט?",
          type: "radio",
          options: ["כן", "לא"],
          required: true,
          showWhenNotContains: { field: "citizenships", value: "ארה״ב" }
        },
        {
          id: "visa_passport_choice",
          label: "על איזה דרכון להוציא את הוויזה?",
          type: "select",
          options: visaPassportOptions,
          required: true,
          layout: "full",
          visibleWhen: () => state.values.student_visa_needed === "כן" && visaPassportOptions().length > 1
        },
        {
          id: "prior_f1_visa_during_group",
          label: "האם הייתה ברשותך ויזת סטודנט במהלך לימודיך בקבוצה?",
          type: "radio",
          options: ["כן", "לא"],
          required: true,
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" },
          showWhenIn: { field: "student_group_year", values: ["קבוצה תשפ\"ו", "קבוצה תשפ\"ה", "קבוצה תשפ\"ד"] }
        },
        {
          id: "prior_f1_visa_valid",
          label: "האם ויזת ה-F-1 שברשותך עדיין בתוקף?",
          type: "radio",
          options: ["כן", "לא"],
          required: true,
          hint: "הכוונה לוויזה המודבקת בדרכון, ולא לטופס I-20.",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "prior_f1_visa_during_group", equals: "כן" },
          showWhenIn: { field: "student_group_year", values: ["קבוצה תשפ\"ו", "קבוצה תשפ\"ה", "קבוצה תשפ\"ד"] }
        },
        {
          id: "prior_f1_visa_expiration",
          label: "תאריך תפוגת הוויזה",
          type: "date",
          required: true,
          hint: "עד איזה תאריך הוויזה בתוקף?",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "prior_f1_visa_valid", equals: "כן" },
          showWhenIn: { field: "student_group_year", values: ["קבוצה תשפ\"ו", "קבוצה תשפ\"ה", "קבוצה תשפ\"ד"] }
        },
        {
          id: "arrival_visa",
          label: "על איזו ויזה אתה מגיע?",
          type: "radio",
          options: ["גרין כארד", "ויזת תייר", "איסטא", "אחר"],
          required: true,
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "לא" }
        },
        { id: "arrival_visa_other", label: "פירוט אשרה אחרת", type: "text", required: true, hideWhenContains: { field: "citizenships", value: "ארה״ב" }, showWhen: { field: "arrival_visa", equals: "אחר" } }
      ]
    },
    {
      id: "parents",
      title: "פרטי הורים",
      fields: [
        { id: "father_section", type: "section", label: "פרטי האב" },
        { id: "father_name", label: "שם האב", type: "text", required: true },
        { id: "father_phone", label: "מספר טלפון אב", type: "tel", required: true },
        { id: "father_email", label: "אימייל אב", type: "text", required: true, emailOrNone: true, layout: "pair", hint: "באם אין כתובת אימייל, יש לכתוב: אין לי." },
        { id: "father_email_confirm", label: "אימות אימייל אב", type: "text", required: true, matches: "father_email", emailOrNone: true, layout: "pair", hint: "אם כתבת אין לי בשדה הקודם, יש לכתוב גם כאן: אין לי." },
        { id: "mother_section", type: "section", label: "פרטי האם" },
        { id: "mother_name", label: "שם האם", type: "text", required: true },
        { id: "mother_phone", label: "מספר טלפון אם", type: "tel", required: true },
        { id: "mother_email", label: "אימייל אם", type: "text", required: true, emailOrNone: true, layout: "pair", hint: "באם אין כתובת אימייל, יש לכתוב: אין לי." },
        { id: "mother_email_confirm", label: "אימות אימייל אם", type: "text", required: true, matches: "mother_email", emailOrNone: true, layout: "pair", hint: "אם כתבת אין לי בשדה הקודם, יש לכתוב גם כאן: אין לי." },
        { id: "parents_status_section", type: "section", label: "מצב משפחתי של ההורים" },
        {
          id: "parents_live_together",
          label: "האם ההורים חיים ומתגוררים יחד?",
          type: "radio",
          options: ["כן", "לא"],
          required: true
        },
        {
          id: "parents_live_together_details",
          label: "פרט",
          type: "textarea",
          required: true,
          showWhen: { field: "parents_live_together", equals: "לא" }
        },
        { id: "parents_address_section", type: "section", label: "כתובת מגורי ההורים" },
        { id: "parents_street", label: "רחוב ומספר בית", type: "text", required: true, autocomplete: "street-address", layout: "full", showWhen: { field: "parents_live_together", equals: "כן" } },
        { id: "parents_city", label: "עיר", type: "text", required: true, autocomplete: "address-level2", showWhen: { field: "parents_live_together", equals: "כן" } },
        { id: "parents_state", label: "מדינה", type: "text", required: true, autocomplete: "address-level1", showWhen: { field: "parents_live_together", equals: "כן" } },
        { id: "parents_zip", label: "מיקוד", type: "text", required: true, autocomplete: "postal-code", showWhen: { field: "parents_live_together", equals: "כן" } },
        { id: "father_address_section", type: "section", label: "כתובת מגורי האב", inlineToggle: { fieldId: "father_address_not_relevant", label: "לא רלוונטי" }, showWhen: { field: "parents_live_together", equals: "לא" } },
        { id: "father_street", label: "רחוב ומספר בית", type: "text", required: true, autocomplete: "street-address", layout: "full", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "father_address_not_relevant", equals: true } },
        { id: "father_city", label: "עיר", type: "text", required: true, autocomplete: "address-level2", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "father_address_not_relevant", equals: true } },
        { id: "father_state", label: "מדינה", type: "text", required: true, autocomplete: "address-level1", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "father_address_not_relevant", equals: true } },
        { id: "father_zip", label: "מיקוד", type: "text", required: true, autocomplete: "postal-code", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "father_address_not_relevant", equals: true } },
        { id: "mother_address_section", type: "section", label: "כתובת מגורי האם", inlineToggle: { fieldId: "mother_address_not_relevant", label: "לא רלוונטי" }, showWhen: { field: "parents_live_together", equals: "לא" } },
        { id: "mother_street", label: "רחוב ומספר בית", type: "text", required: true, autocomplete: "street-address", layout: "full", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "mother_address_not_relevant", equals: true } },
        { id: "mother_city", label: "עיר", type: "text", required: true, autocomplete: "address-level2", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "mother_address_not_relevant", equals: true } },
        { id: "mother_state", label: "מדינה", type: "text", required: true, autocomplete: "address-level1", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "mother_address_not_relevant", equals: true } },
        { id: "mother_zip", label: "מיקוד", type: "text", required: true, autocomplete: "postal-code", showWhen: { field: "parents_live_together", equals: "לא" }, disabledWhen: { field: "mother_address_not_relevant", equals: true } }
      ]
    },
    {
      id: "dormitory_rules",
      title: "כללי הפנימייה",
      fields: [
        {
          id: "dormitory_intro",
          type: "intro_text",
          title: "פנימייה",
          paragraphs: [
            "כחלק ממסגרת הישיבה, אנו מפעילים פנימיות המיועדות למקומות לינה עבור בחורי הישיבה. הפנימיות ממוקמות כולן בקרבת 770, במרחק הליכה.",
            "לתשומת לב: עבור תלמידים הלומדים בארצות הברית באמצעות ויזת תלמיד (F-1), המגורים בפנימיות הישיבה הם תנאי מחייב כחלק מתנאי התוכנית. בהתאם לכך, לא ניתן להתגורר או ללון במקום אחר במהלך תקופת הלימודים."
          ],
          sections: () =>
            (state.values.student_group_year || defaultGroupYear) === defaultGroupYear
              ? [
                  {
                    title: "תקופות ההגעה",
                    paragraphs: [
                      "חשוב לדעת כי קיימות שתי תקופות שונות מבחינת תנאי השהות:",
                      "תקופת תשרי (מט\"ו אלול ועד ז' במרחשון) – בתקופה זו שוהות במקביל שתי קבוצות, ולכן תנאי השהות שונים מהרגיל. ייתכנו צפיפות גבוהה יותר, דירות נוספות ברמת אבזור בסיסית יותר ומרחק הליכה גדול יותר.",
                      "לאחר ז' במרחשון – מתבצע השיבוץ הקבוע, והוא יהיה מקום השינה של הבחור למשך שאר שנת הלימודים.",
                      "השיבוץ בפנימיות נעשה על ידי הנהלת הישיבה בהתאם לשיקולים חינוכיים, רוחניים וארגוניים. ניתן להגיש בקשות והעדפות, אולם אין אפשרות להתחייב לשיבוץ בדירה או בבניין מסוים."
                    ]
                  }
                ]
              : [
                  {
                    title: "פנימיות בוגרים",
                    paragraphs: [
                      "גם עבור בוגרי הישיבה, המגורים בפנימייה הם חלק בלתי נפרד ממסגרת הלימודים ונדרשת לינה באחת מפנימיות הישיבה.",
                      "לשם כך, הישיבה התקשרה בהסכם עם פנימיית 749, והלינה בה נחשבת כלינה בפנימיות הישיבה לכל דבר ועניין. במידת הצורך ובהתאם למספר הנרשמים, תפעיל הישיבה פנימיות נוספות המיועדות לבוגרי הישיבה.",
                      "התשלום לישיבה כולל גם את מקום הלינה בפנימייה. בוגרים שישובצו בפנימיית 749 יקבלו את מקום הלינה במסגרת הסדר זה, ללא תשלום נוסף."
                    ]
                  }
                ]
        },
        {
          id: "dormitory_rules_info",
          type: "intro_text",
          title: "כללי הפנימייה",
          paragraphs: [],
          disclosure: {
            label: "כללי הפנימייה",
            title: "כללי הפנימייה",
            paragraphs: [
              "הפנימייה היא ביתם של תלמידי התמימים במשך שנת הלימודים. מטרת הכללים היא לשמור על אווירה חסידית, על רווחת כלל הבחורים ועל התנהלות תקינה של הפנימיות."
            ],
            sections: [
              {
                title: "1. נוכחות בפנימייה",
                paragraphs: ["על התלמיד לשהות בפנימייה בזמני השינה והקימה, בהתאם לנהלים ולזמנים שייקבעו על ידי הנהלת הישיבה. אין ללון מחוץ לפנימייה ללא אישור מראש."]
              },
              {
                title: "2. הנהלת הפנימייה",
                paragraphs: ["יש להישמע להוראות הנהלת הישיבה, מנהל הפנימיות והמדריכים בכל עניין הקשור להתנהלות בפנימייה."]
              },
              {
                title: "3. שמירה על ניקיון ורכוש",
                paragraphs: ["כל תלמיד אחראי לשמירת הניקיון והסדר בחדרו ובשטחי הפנימייה. יש לשמור על הציוד ועל רכוש הפנימייה, ואין לבצע כל שינוי במבנה החדר, במיטות או בציוד ללא אישור מראש."]
              },
              {
                title: "4. המטבח",
                paragraphs: ["המטבח מיועד לשימוש אישי בלבד. יש לשמור על ניקיונו ולהשתמש בו בהתאם להוראות הפנימייה. אין לבשל מחוץ למטבח, ואין לבשל לאחר השעה 23:00."]
              },
              {
                title: "5. יחס לסביבה",
                paragraphs: ["חל איסור להרעיש או להפריע לשכנים בכל צורה שהיא. יש להימנע מכל התנהגות העלולה לגרום לבעיות מול השכנים או מול הרשויות."]
              },
              {
                title: "6. אורחים",
                paragraphs: ["אין להלין אורחים בפנימייה ללא אישור מפורש מהנהלת הישיבה – הפרת כלל זה תגרור קנס של 120 דולר לחברי החדר."]
              },
              {
                title: "7. עישון",
                paragraphs: ["חל איסור מוחלט לעשן או להחזיק אמצעי עישון מכל סוג בכל שטח הפנימייה."]
              },
              {
                title: "8. מכשירים אלקטרוניים",
                paragraphs: ["השימוש במכשירים אלקטרוניים מותר אך ורק בהתאם לנהלי הישיבה. חובה להתקין את סינון הישיבה על כל מכשיר, ואין להשתמש במכשיר או בתוכן שאינם מאושרים על פי נהלי הישיבה."]
              },
              {
                title: "9. אווירת הפנימייה",
                paragraphs: ["על כל תלמיד לנהוג באופן ההולם בחור בישיבת תומכי תמימים, לשמור על אווירה חסידית, ולכבד את כלל תלמידי הישיבה."]
              },
              {
                title: "10. הפרת הנהלים",
                paragraphs: ["אי־עמידה בכללי הפנימייה או בהוראות הנהלת הישיבה עלולה להביא לנקיטת צעדים משמעתיים, לרבות קנסות, העברה בין חדרים או בין פנימיות, הפחתת הפיקדון, או שלילת הזכאות למקום לינה, בהתאם להחלטת הנהלת הישיבה."]
              }
            ]
          }
        },
        {
          id: "dormitory_rules_accepted",
          label: "אני מאשר כי קראתי את כללי הפנימייה, ואני מתחייב לפעול על פיהם במשך כל תקופת שהותי במסגרת תלמידי התמימים.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_commitment_presence",
          label: "אני מתחייב לשהות בפנימייה בזמני השינה והקימה, בהתאם לנהלים ולזמנים שייקבעו על ידי הנהלת הישיבה.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_commitment_staff",
          label: "אני מתחייב להישמע להוראות הנהלת הישיבה, מנהל הפנימיות והמדריכים.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_commitment_cleanliness",
          label: "אני מתחייב לשמור על ניקיון החדר, רכוש הפנימייה והשימוש התקין במטבחים ובמתקני הפנימייה.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_commitment_restrictions",
          label: "אני מתחייב שלא להלין אורחים בפנימייה ללא אישור מפורש מהנהלת הישיבה, שלא לעשן בתחומי הפנימייה, ולהשתמש במכשירים אלקטרוניים בהתאם לנהלי הישיבה בלבד. ידוע לי כי הפרת כלל הלנת אורחים תגרור קנס של 120 דולר לחברי החדר.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_commitment_discipline",
          label: "אני מתחייב ומאשר כי ידוע לי שהפרת כללי הפנימייה או הוראות הנהלת הישיבה עלולה להביא לנקיטת צעדים משמעתיים, לרבות קנסות, העברה בין חדרים או שלילת הזכאות למקום לינה.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        },
        {
          id: "dormitory_rules_signature",
          label: "חתימת התלמיד",
          type: "signature",
          required: true,
          hint: "יש לחתום בעכבר, באצבע במסך מגע או בעט דיגיטלי."
        }
      ]
    },
    {
      id: "emergency_health",
      title: "חירום ובריאות",
      fields: [
        {
          id: "health_intro",
          type: "intro_text",
          title: "שאלון בריאות",
          paragraphs: [
            "מטרת השאלון הרפואי היא לאפשר לצוות הישיבה להעניק לתלמיד את הסיוע המתאים במקרה הצורך. המידע יישמר באופן חסוי וישמש את הצוות המורשה בלבד."
          ]
        },
        { id: "emergency_section", type: "section", label: "איש קשר חירום" },
        {
          id: "emergency_intro",
          type: "intro_text",
          title: "פרטי איש קשר",
          paragraphs: [
            "אנא ציינו איש קשר שניתן יהיה לפנות אליו במקרה חירום. מומלץ, במידת האפשר, לציין אדם המתגורר באזור ניו יורק ואינו אחד מההורים."
          ]
        },
        { id: "emergency_name", label: "שם מלא של איש קשר חירום", type: "text", required: true },
        { id: "emergency_phone", label: "מספר טלפון של איש קשר חירום", type: "tel", required: true },
        { id: "emergency_relation", label: "קרבה לתלמיד", type: "text", required: true },
        { id: "medical_measurements_section", type: "section", label: "נתונים רפואיים כלליים" },
        { id: "weight", label: "משקל", type: "text", unit: 'ק"ג' },
        { id: "height", label: "גובה", type: "text", unit: 'ס"מ' },
        { id: "last_tetanus_date", label: "תאריך חיסון טטנוס אחרון", type: "date" },
        { id: "allergies_section", type: "section", label: "אלרגיות ורגישויות" },
        {
          id: "special_diet",
          label: "האם קיימות דרישות תזונתיות מיוחדות?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "special_diet_details"
        },
        {
          id: "special_diet_details",
          label: "אנא פרט בקצרה",
          type: "textarea",
          required: true,
          showWhen: { field: "special_diet", equals: "כן" }
        },
        {
          id: "allergies",
          label: "האם קיימות אלרגיות?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "allergies_details"
        },
        { id: "allergies_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "allergies", equals: "כן" } },
        {
          id: "medication_allergy",
          label: "האם קיימת אלרגיה לתרופות?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "medication_allergy_details"
        },
        { id: "medication_allergy_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "medication_allergy", equals: "כן" } },
        {
          id: "asthma",
          label: "האם קיימת אסתמה?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "asthma_details"
        },
        { id: "asthma_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "asthma", equals: "כן" } },
        {
          id: "eczema_hives",
          label: "האם קיימת אקזמה או סרפדת?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "eczema_hives_details"
        },
        { id: "eczema_hives_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "eczema_hives", equals: "כן" } },
        { id: "background_conditions_section", type: "section", label: "מחלות רקע" },
        { id: "tuberculosis", label: "האם כיום או בעבר הייתה שחפת?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "tuberculosis_details" },
        { id: "tuberculosis_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "tuberculosis", equals: "כן" } },
        { id: "epilepsy", label: "האם כיום או בעבר הייתה אפילפסיה?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "epilepsy_details" },
        { id: "epilepsy_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "epilepsy", equals: "כן" } },
        { id: "diabetes", label: "האם קיימת סוכרת?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "diabetes_details" },
        { id: "diabetes_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "diabetes", equals: "כן" } },
        { id: "significant_other_condition", label: "האם קיימת מחלה משמעותית אחרת?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "significant_other_condition_details" },
        { id: "significant_other_condition_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "significant_other_condition", equals: "כן" } },
        { id: "mental_health_section", type: "section", label: "בריאות נפשית" },
        {
          id: "eating_disorder",
          label: "האם כיום או בעבר הייתה הפרעת אכילה?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "eating_disorder_details"
        },
        { id: "eating_disorder_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "eating_disorder", equals: "כן" } },
        {
          id: "psychological_treatment",
          label: "האם כיום או בעבר התקבל ייעוץ או טיפול פסיכולוגי?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "psychological_treatment_details"
        },
        { id: "psychological_treatment_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "psychological_treatment", equals: "כן" } },
        {
          id: "emotional_condition",
          label: "האם קיימת מחלה נפשית או רגשית?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "emotional_condition_details"
        },
        { id: "emotional_condition_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "emotional_condition", equals: "כן" } },
        { id: "medical_history_section", type: "section", label: "היסטוריה רפואית" },
        {
          id: "hospitalization_surgery",
          label: "האם כיום או בעבר היו אשפוזים או ניתוחים?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "hospitalization_surgery_details"
        },
        { id: "hospitalization_surgery_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "hospitalization_surgery", equals: "כן" } },
        {
          id: "regular_medication",
          label: "האם הנך נוטל כיום תרופות באופן קבוע?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "regular_medication_details"
        },
        { id: "regular_medication_details", label: "נא לציין פרטים נוספים: רשימת התרופות, המינון והוראות השימוש", type: "textarea", required: true, showWhen: { field: "regular_medication", equals: "כן" } },
        {
          id: "medications_last_three_years",
          label: "האם נטלת תרופות בקביעות בשלוש השנים האחרונות?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "medications_last_three_years_details"
        },
        {
          id: "medications_last_three_years_details",
          label: "נא לציין פרטים נוספים: התרופות והסיבה לנטילתן",
          type: "textarea",
          required: true,
          showWhen: { field: "medications_last_three_years", equals: "כן" }
        },
        { id: "body_systems_section", type: "section", label: "ממצאים רפואיים לפי מערכות הגוף" },
        {
          id: "body_systems_intro",
          type: "intro_text",
          title: "הנחיה למילוי",
          paragraphs: [
            "בחלק זה אין צורך לציין מצבים שגרתיים שאינם בעלי משמעות רפואית (כגון שימוש במשקפיים או בעדשות מגע). אנא סמנו רק מחלות, ממצאים רפואיים או בעיות משמעותיות שחשוב שהצוות יהיה מודע אליהן."
          ]
        },
        { id: "digestive_condition", label: "האם קיימת מחלה או בעיה משמעותית במערכת העיכול?", type: "radio", options: ["לא", "כן"], required: true, hint: "כגון עצירות או שלשולים כרוניים.", detailsField: "digestive_condition_details" },
        { id: "digestive_condition_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "digestive_condition", equals: "כן" } },
        { id: "eye_findings", label: "האם קיים ממצא רפואי משמעותי הקשור לעיניים?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "eye_findings_details" },
        { id: "eye_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "eye_findings", equals: "כן" } },
        { id: "ear_findings", label: "האם קיים ממצא רפואי משמעותי הקשור לאוזניים?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "ear_findings_details" },
        { id: "ear_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "ear_findings", equals: "כן" } },
        { id: "nose_findings", label: "האם קיים ממצא רפואי משמעותי הקשור לאף?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "nose_findings_details" },
        { id: "nose_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "nose_findings", equals: "כן" } },
        { id: "mouth_throat_findings", label: "האם קיים ממצא רפואי משמעותי הקשור לפה או לגרון?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "mouth_throat_findings_details" },
        { id: "mouth_throat_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "mouth_throat_findings", equals: "כן" } },
        { id: "skin_findings", label: "האם קיים ממצא רפואי משמעותי הקשור לעור?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "skin_findings_details" },
        { id: "skin_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "skin_findings", equals: "כן" } },
        { id: "heart_findings", label: "האם קיימת מחלת לב או ממצא רפואי משמעותי הקשור ללב?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "heart_findings_details" },
        { id: "heart_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "heart_findings", equals: "כן" } },
        { id: "lung_findings", label: "האם קיימת מחלת נשימה או ממצא רפואי משמעותי הקשור לריאות?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "lung_findings_details" },
        { id: "lung_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "lung_findings", equals: "כן" } },
        { id: "nervous_system_findings", label: "האם קיים ממצא רפואי משמעותי הקשור למערכת העצבים?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "nervous_system_findings_details" },
        { id: "nervous_system_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "nervous_system_findings", equals: "כן" } },
        { id: "orthopedic_findings", label: "האם קיים ממצא אורתופדי משמעותי?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "orthopedic_findings_details" },
        { id: "orthopedic_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "orthopedic_findings", equals: "כן" } },
        { id: "speech_findings", label: "האם קיים קושי בדיבור או ממצא רפואי משמעותי הקשור לדיבור?", type: "radio", options: ["לא", "כן"], required: true, detailsField: "speech_findings_details" },
        { id: "speech_findings_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "speech_findings", equals: "כן" } },
        {
          id: "physical_limitation",
          label: "האם קיימת מגבלה פיזית?",
          type: "radio",
          options: ["לא", "כן"],
          required: true,
          detailsField: "physical_limitation_details"
        },
        { id: "physical_limitation_details", label: "אנא פרט בקצרה", type: "textarea", required: true, showWhen: { field: "physical_limitation", equals: "כן" } },
        { id: "additional_health_section", type: "section", label: "מידע נוסף" },
        {
          id: "additional_health_info",
          label: "האם ישנו משהו נוסף מיוחד בבריאותך אותו אנחנו צריכים לדעת?",
          type: "textarea"
        },
        {
          id: "health_document",
          label: "צרף מסמכים רפואיים רלוונטיים",
          type: "file",
          multiple: true,
          hint: "אפשר לצרף יותר מקובץ אחד, כגון אישורי רופא, סיכומי טיפול, מרשמים או מסמך רפואי חשוב אחר."
        },
        { id: "health_declaration_section", type: "section", label: "הצהרה" },
        {
          id: "health_update_notice",
          type: "intro_text",
          title: "עדכון מצב רפואי",
          paragraphs: [
            "אם יחול שינוי משמעותי במצבו הרפואי של התלמיד לאחר מילוי הטופס, יש לעדכן את הנהלת הישיבה בהקדם."
          ]
        },
        {
          id: "health_information_confirmed",
          label: "אני מאשר שכל המידע שמסרתי נכון ומדוייק",
          type: "checkbox",
          required: true,
          checkboxText: "מאשר",
          layout: "full"
        },
        {
          id: "health_signature",
          label: "חתימה ידנית",
          type: "signature",
          required: true,
          hint: "יש לחתום בעכבר, באצבע במסך מגע או בעט דיגיטלי."
        }
      ]
    },
    {
      id: "registration_payment",
      title: "דמי הרשמה",
      fields: [
        {
          id: "registration_payment_info",
          type: "intro_text",
          title: "תשלום דמי הרשמה",
          paragraphs: [
            "כדי להמשיך לסיכום ושליחת הטופס, יש לשלם דמי הרשמה חד־פעמיים בסך 10 דולר.",
            "התשלום מתבצע בצורה מאובטחת דרך Stripe. לאחר אישור התשלום תחזרו לטופס ותוכלו להמשיך לסיכום הפרטים ולשליחת הבקשה.",
            "אם התשלום כבר בוצע, אך מסיבה כלשהי חזרתם לטופס, אין צורך לשלם שוב. לחצו על \"שילמתי כבר\", והמערכת תנסה לאתר את התשלום שבוצע על פי השם באנגלית ותאריך הלידה שהוזנו בטופס."
          ],
          signature: []
        },
        {
          id: "registration_payment",
          type: "payment",
          required: true,
          amountUsd: 10
        }
      ]
    },
    {
      id: "tuition",
      title: "שכר לימוד",
      fields: [
        {
          id: "tuition_info",
          type: "intro_text",
          title: "שכר לימוד",
          paragraphs: () => [
            `עלות החזקת תלמיד בישיבה עומדת על ${tuitionAmounts().full} דולר לחודש.`,
            "סכום זה משקף את העלויות הכרוכות בהפעלת המסגרת, ובכלל זה הפעלת הפנימיות, שכירת מקומות לינה, צוות והוצאות נוספות לאורך כל שנת הלימודים.",
            tuitionPeriodText(),
            "אמצעי התשלום הרגיל הוא כרטיס אשראי, המחויב באופן אוטומטי בהתאם ללוח התשלומים. ניתן לשלם גם באמצעות צ'קים, בתיאום מראש ובמסירת כל הצ'קים מראש."
          ],
          sections: [
            {
              title: "לוח התשלומים",
              items: tuitionPaymentScheduleItems
            },
            {
              title: "בקשת הנחה",
              paragraphs: [
                "אנו מודעים לכך שלעיתים קיימים קשיים כלכליים, ולכן פועלת במסגרת התוכנית קרן חירות, המסייעת למשפחות הזקוקות להשתתפות בשכר הלימוד.",
                "לצד רצוננו לסייע לכל הפונים, חשוב לדעת כי משאבי הקרן מוגבלים. ועדת ההנחות תעשה כמיטב יכולתה להעניק את הסיוע המרבי האפשרי לכל משפחה, בהתאם לנתוניה ולמשאבים העומדים לרשות הקרן."
              ]
            }
          ],
          signature: []
        },
        {
          id: "discount_request_type",
          label: "באפשרותכם לבחור אחת מהאפשרויות הבאות:",
          type: "radio",
          options: tuitionDiscountOptions,
          required: true,
          relaxed: true
        },
        {
          id: "discount_form_section",
          type: "intro_text",
          title: "בקשת הנחה",
          paragraphs: [
            "יש להוריד את קובץ בקשת ההנחה ולמלא אותו בנפרד."
          ],
          discountPreview: true,
          links: [
            {
              label: "הורד את קובץ בקשת ההנחה",
              url: discountFormFileUrl,
              download: true
            }
          ],
          note: "את בקשת ההנחה יש לשלוח לכתובת: cherut@kvutze.org",
          signature: [],
          showWhen: { field: "discount_request_type", equals: additionalDiscountOption }
        }
      ]
    },
    {
      id: "deposit",
      title: "פיקדון",
      fields: [
        {
          id: "deposit_info",
          type: "intro_text",
          title: "פיקדון",
          paragraphs: [
            "בסיום תהליך הרישום על כל תלמיד להפקיד פקדון על סך 300$ לפני תחילת השהות. הפקדון נועד להבטיח את שמירת הכללים ואת העמידה בתנאי התשלום, וניתן להפקידו בכרטיס אשראי בצ'ק או בהעברה בנקאית.",
            "חשוב להבהיר כי אנו גובים את הפקדון והוא נשמר אצלנו לאורך כל התקופה.",
            "עם תום השהות יוחזר הפקדון — באותו אופן שבו שולם, ותוך 30 יום ממועד היציאה — לאחר יציאה מוחלטת מהפנימייה, לרבות פינוי כל החפצים האישיים. זאת, אלא אם מצאה ההנהלה עילה להפחתתו.",
            "שימו לב: הרישום יושלם רק לאחר חתימת חוזה התשלום, הסדרת אמצעי התשלום והפקדת הפיקדון."
          ],
          signature: []
        },
        {
          id: "deposit_terms_accepted",
          label: "אני מאשר כי קראתי והבנתי את תנאי הפיקדון, ואני מסכים להפקיד פיקדון בסך 300 דולר בהתאם לתנאים המפורטים לעיל.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        }
      ]
    },
    {
      id: "student_visa_rules",
      title: "חתימה על כללי הוויזה",
      fields: [
        {
          id: "student_visa_rules_section",
          type: "section",
          label: "כללי ויזת סטודנט",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_i20",
          label: "ידוע לי כי אישור הלימודים (טופס ה-I-20) מונפק על ידי מוסד הלימודים מכון חנה, וכי מטרת הגעתי לארצות הברית היא לצורך לימודים במוסד זה בלבד, ולא לכל מטרה אחרת.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_attendance",
          label: "ידוע לי כי קבלת מעמד הסטודנט והמשך שמירתו מותנים בהשתתפות סדירה ומלאה בכל תוכניות הלימוד, השיעורים והפעילויות הנדרשות על ידי המוסד. היעדרויות, אי-עמידה בדרישות הלימוד או אי-שמירה על נהלי המוסד עלולים להביא לפגיעה במעמד הסטודנט, לרבות ביטול אישור הלימודים, בהתאם לדין ולהוראות המוסד.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_travel",
          label: "ידוע לי כי כל יציאה מהעיר, מהמדינה או מחוץ לארצות הברית מחייבת קבלת אישור מראש מהמשרד, לאחר מסירת פרטי הנסיעה והמועדים המתוכננים.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_work",
          label: "ידוע לי כי בהתאם לתנאי ויזת הסטודנט, חל עליי איסור לעבוד במהלך שנת הלימודים. ידוע לי כי עבודה בניגוד לתנאי הוויזה מהווה הפרה של מעמד הסטודנט, ועלולה להביא לביטול המעמד ולהשלכות נוספות על פי חוק.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_dormitory",
          label: "ידוע לי כי השתתפותי בתוכנית הלימודים מותנית במגורים בפנימיות הישיבה במשך כל תקופת הלימודים.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_rule_confirmation",
          label: "אני מאשר כי קראתי בעיון את כל האמור לעיל, הבנתי את משמעותו, ואני מתחייב לפעול בהתאם לכל הנהלים וההוראות של מכון חנה ולכל דרישות רשויות ההגירה של ארצות הברית.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        },
        {
          id: "student_visa_signature",
          label: "חתימת תלמיד לאישור כללי ויזת סטודנט",
          type: "signature",
          required: true,
          hint: "יש לחתום בעכבר, באצבע במסך מגע או בעט דיגיטלי.",
          hideWhenContains: { field: "citizenships", value: "ארה״ב" },
          showWhen: { field: "student_visa_needed", equals: "כן" }
        }
      ]
    },
    {
      id: "agreements",
      title: "שימוש בתמונות",
      fields: [
        {
          id: "media_permission_text",
          type: "intro_text",
          title: "אישור שימוש בתמונות ובסרטונים",
          paragraphs: [
            "במהלך שנת הלימודים והפעילויות השונות של תוכנית תלמידי התמימים, אנו מצלמים תמונות וסרטונים. חומרים אלו עשויים לשמש את מכון חנה לצורכי תיעוד, פרסום וקידום פעילותו, לרבות באתר האינטרנט, ברשתות החברתיות, בפרסומים ובחומרי הסברה."
          ],
          signature: []
        },
        {
          id: "media_permission",
          label: "אישור שימוש בתמונות ובסרטונים",
          type: "radio",
          options: [
            "אני מאשר למכון חנה להשתמש בתמונות ובסרטונים בהם אני מופיע.",
            "איני מאשר למכון חנה להשתמש בתמונות ובסרטונים שבהם אני מופיע. ידוע לי כי באחריותי להשתדל, ככל האפשר, שלא להופיע בתמונות ובסרטונים המצולמים במסגרת פעילות המכון."
          ],
          required: true,
          relaxed: true
        },
        {
          id: "media_signature",
          label: "חתימה",
          type: "signature",
          required: true,
          hint: "יש לחתום בעכבר, באצבע במסך מגע או בעט דיגיטלי."
        }
      ]
    },
    {
      id: "next_steps",
      title: "המשך תהליך הרישום",
      fields: [
        {
          id: "next_steps_info",
          type: "intro_text",
          title: "תודה על הזמן שהקדשתם למילוי טופס הרישום",
          paragraphs: [
            "לאחר שליחת הטופס, בקשתכם תתקבל במערכת ותעבור לבדיקת צוות המשרד. אנו משתדלים להשיב לכל בקשת רישום בתוך עד 5 ימי עסקים.",
            "לאחר לחיצה על \"המשך\", יוצג עמוד הסיכום שבו תוכלו לעבור על כל הפרטים שמסרתם לפני שליחת טופס הרישום."
          ],
          sections: [
            {
              title: "המשך תהליך הרישום",
              items: [
                "בדיקת הבקשה – צוות המשרד יעבור על הפרטים והמסמכים שהוגשו. במידת הצורך ניצור עמכם קשר להשלמת מידע.",
                "קבלה לתוכנית – הקבלה לתוכנית תלמידי התמימים מותנית באישור ההנהלה הרוחנית.",
                "בקשת הנחה – אם הוגשה בקשת הנחה, היא תועבר לוועדת ההנחות, המתכנסת מדי יום ראשון. לאחר קבלת ההחלטה תישלח אליכם הודעה.",
                "חוזה התשלום – לאחר אישור הרישום יישלח אליכם חוזה התשלום לחתימה.",
                "השלמת הרישום – לאחר חתימת החוזה, הסדרת אמצעי התשלום והפקדת הפיקדון, יושלם הליך הרישום.",
                "אישור הלימודים (I-20) – לאחר השלמת כל שלבי הרישום והתשלומים, יונפק אישור הלימודים, ככל שהוא נדרש לצורך הוצאת ויזת סטודנט."
              ]
            },
            {
              title: "בכל שאלה ניתן לפנות למזכירות",
              items: [
                "בימים א'-ה', משעה 19:00 ועד לשעה 21:00.",
                "טלפון: 03-7223149 שלוחה 1",
                "טלפון נוסף: 18647770770+",
                "דוא\"ל: reception@kvutze.org",
                "וואצאפ: 18647770770"
              ]
            }
          ]
        },
        {
          id: "response_recipient",
          label: "לאיזו כתובת דוא\"ל תרצו שנשלח את תשובת הרישום?",
          type: "radio",
          options: responseRecipientOptions,
          required: true
        }
      ]
    },
    {
      id: "review",
      title: "סקירה ושליחה",
      isReview: true,
      fields: [
        {
          id: "final_confirmation",
          label: "אני מאשר כי עברתי על כל הפרטים שמסרתי בטופס, וכי הם נכונים ומלאים ככל הידוע לי.",
          type: "checkbox",
          agreement: true,
          required: true,
          layout: "wide"
        }
      ]
    }
  ];

  const state = {
    stepIndex: loadDraftStep(),
    values: loadDraft(),
    files: {},
    signatures: {},
    returnToReviewFromStep: null
  };
  ensureDefaultValues();

  const stepList = document.getElementById("stepList");
  const stepTitle = document.getElementById("stepTitle");
  const progressText = document.getElementById("progressText");
  const progressBar = document.getElementById("progressBar");
  const formFields = document.getElementById("formFields");
  const formError = document.getElementById("formError");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("registrationForm");
  const spamTrapInput = document.getElementById("contactCompany");
  const submissionProgress = document.getElementById("submissionProgress");
  const submissionProgressTitle = document.getElementById("submissionProgressTitle");
  const submissionProgressPercent = document.getElementById("submissionProgressPercent");
  const submissionProgressBar = document.getElementById("submissionProgressBar");
  let submissionProgressTimer = null;
  const submissionProgressSteps = [
    { title: "מכין את הטופס לשליחה...", percent: 12 },
    { title: "מצרף את הקבצים...", percent: 28 },
    { title: "שולח את הנתונים...", percent: 46 },
    { title: "שומר את הקבצים...", percent: 72 },
    { title: "מסיים רישום ושולח אישור...", percent: 90 }
  ];
  const visibilityControllerIds = new Set(
    steps.flatMap((step) =>
      step.fields.flatMap((field) =>
        [
          field.showWhen?.field,
          field.showWhenIn?.field,
          field.showWhenNotContains?.field,
          field.showWhenAnyExcept?.field,
          field.hideWhen?.field,
          field.hideWhenContains?.field,
          field.disabledWhen?.field
        ].filter(Boolean)
      )
    )
  );

  document.getElementById("saveDraftTop").addEventListener("click", saveDraft);
  prevBtn.addEventListener("click", previousStep);
  nextBtn.addEventListener("click", nextStep);
  form.addEventListener("submit", submitRegistration);

  handlePaymentReturn();
  render();

  function render() {
    ensureVisibleStep();
    const step = steps[state.stepIndex];
    document.querySelector(".registration-card").classList.toggle("review-mode", step.isReview);
    stepTitle.textContent = step.id === "intro" ? "" : step.title;
    stepTitle.classList.toggle("hidden", step.id === "intro");
    const progress = visibleProgress();
    progressText.textContent = `שלב ${progress.current} מתוך ${progress.total}`;
    progressBar.style.width = `${(progress.current / progress.total) * 100}%`;
    formError.textContent = "";

    renderSteps();
    renderFields(step);

    const editingFromReview = state.returnToReviewFromStep === step.id;
    prevBtn.disabled = state.stepIndex === 0;
    prevBtn.textContent = step.isReview ? "⬅ חזרה לטופס" : "חזור";
    prevBtn.style.display = editingFromReview ? "none" : "inline-block";
    nextBtn.textContent = editingFromReview ? "חזור לסיכום" : state.stepIndex === 0 ? "התחל" : "הבא";
    nextBtn.style.display = state.stepIndex === steps.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = state.stepIndex === steps.length - 1 ? "inline-block" : "none";
    submitBtn.textContent = step.isReview ? "שלח את טופס הרישום" : "שלח הרשמה";
  }

  function renderSteps() {
    stepList.innerHTML = "";
  }

  function renderFields(step) {
    formFields.innerHTML = "";

    if (step.isReview) {
      const review = document.createElement("div");
      review.className = "review full";
      review.innerHTML = reviewCards();
      formFields.appendChild(review);
    }

    step.fields.forEach((field) => {
      if (!isVisible(field)) return;

      const wrapper = document.createElement("div");
      if (field.type === "section") {
        wrapper.className = "field-section";
        if (field.inlineToggle) {
          wrapper.classList.add("field-section-with-toggle");
          const title = document.createElement("span");
          title.textContent = field.label;
          const toggleLabel = document.createElement("label");
          toggleLabel.className = "section-inline-toggle";
          const toggleInput = document.createElement("input");
          toggleInput.type = "checkbox";
          toggleInput.id = field.inlineToggle.fieldId;
          toggleInput.checked = Boolean(state.values[field.inlineToggle.fieldId]);
          toggleInput.addEventListener("change", onInput);
          toggleLabel.appendChild(toggleInput);
          toggleLabel.appendChild(document.createTextNode(field.inlineToggle.label));
          wrapper.appendChild(title);
          wrapper.appendChild(toggleLabel);
        } else {
          wrapper.textContent = field.label;
        }
        formFields.appendChild(wrapper);
        return;
      }

      if (field.type === "intro_text") {
        wrapper.className = "intro-card";
        wrapper.innerHTML = `
          <h3>${escapeHtml(field.title)}</h3>
          ${resolveList(field.paragraphs).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          ${field.contactBox ? renderContactBox(field.contactBox) : ""}
          ${field.discountPreview ? renderDiscountPreview() : ""}
          ${field.links?.length ? `<div class="intro-links">${field.links.map((link) => `<a href="${escapeHtml(link.url)}" ${link.download ? "download" : 'target="_blank" rel="noopener noreferrer"'}>${escapeHtml(link.label)}</a>`).join("")}</div>` : ""}
          ${
            resolveList(field.sections).length
              ? resolveList(field.sections)
                  .map(
                    (section) => `
                      <div class="intro-subsection">
                        <h4>${escapeHtml(section.title)}</h4>
                        ${resolveList(section.paragraphs).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") || ""}
                        ${
                          resolveList(section.items).length
                            ? `<ul>${resolveList(section.items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
                            : ""
                        }
                      </div>
                    `
                  )
                  .join("")
              : ""
          }
          ${field.disclosure ? renderDisclosure(field.disclosure) : ""}
          ${field.note ? `<div class="intro-note">${escapeHtml(field.note)}</div>` : ""}
          ${
            field.signature?.length
              ? `<div class="intro-signature">${field.signature.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</div>`
              : ""
          }
        `;
        formFields.appendChild(wrapper);
        return;
      }

      if (field.type === "payment") {
        wrapper.className = "field full";
        wrapper.dataset.field = field.id;
        wrapper.appendChild(createPaymentPanel(field));

        const error = document.createElement("div");
        error.className = "error";
        error.id = `${field.id}_error`;
        wrapper.appendChild(error);

        formFields.appendChild(wrapper);
        return;
      }

      const fullWidthTypes = ["textarea", "checkbox_group", "radio", "file", "signature"];
      const fullWidth = fullWidthTypes.includes(field.type) || field.layout === "wide";
      wrapper.className = `field ${fullWidth ? "full" : ""} ${field.layout === "pair" ? "pair" : ""} ${field.agreement ? "agreement-field" : ""}`;
      wrapper.dataset.field = field.id;

      if (field.type === "checkbox" && field.agreement) {
        wrapper.appendChild(createInput(field));
        const error = document.createElement("div");
        error.id = `${field.id}_error`;
        error.className = "error";
        wrapper.appendChild(error);
        formFields.appendChild(wrapper);
        return;
      }

      const label = document.createElement("label");
      label.htmlFor = field.id;
      label.textContent = `${fieldLabel(field)}${field.required ? " *" : ""}`;
      wrapper.appendChild(label);

      if (field.hint || field.reserveHintSpace) {
        const hint = document.createElement("div");
        hint.className = `hint ${field.reserveHintSpace && !field.hint ? "hint-placeholder" : ""}`;
        hint.textContent = field.hint || "";
        wrapper.appendChild(hint);
      }

      wrapper.appendChild(createInput(field));

      const error = document.createElement("div");
      error.className = "error";
      error.id = `${field.id}_error`;
      wrapper.appendChild(error);

      formFields.appendChild(wrapper);
    });

    if (step.isReview) {
      formFields.querySelectorAll("[data-edit-step]").forEach((button) => {
        button.addEventListener("click", () => goToStep(button.dataset.editStep));
      });
      formFields.querySelectorAll("[data-missing-file-step]").forEach((button) => {
        button.addEventListener("click", () => {
          const missingFile = missingRequiredFiles().find((item) => item.field.id === button.dataset.missingFileField);
          if (missingFile) goToMissingRequiredFile(missingFile);
        });
      });
      formFields.querySelector("[data-print-review]")?.addEventListener("click", () => window.print());
    }
  }

  function createInput(field) {
    if (field.type === "signature") {
      return createSignatureInput(field);
    }

    if (field.type === "textarea") {
      const input = document.createElement("textarea");
      input.id = field.id;
      input.value = state.values[field.id] || "";
      input.disabled = isDisabled(field);
      input.addEventListener("input", onInput);
      return input;
    }

    if (field.type === "select") {
      const select = document.createElement("select");
      select.id = field.id;
      const options = resolveList(field.options);
      select.innerHTML = `<option value="">בחר</option>${options.map((x) => `<option>${escapeHtml(x)}</option>`).join("")}`;
      if (field.defaultValue && state.values[field.id] === undefined) state.values[field.id] = field.defaultValue;
      select.value = state.values[field.id] || "";
      select.disabled = isDisabled(field);
      select.addEventListener("change", onInput);
      return select;
    }

    if (field.type === "radio" || field.type === "checkbox_group") {
      const group = document.createElement("div");
      group.className = `choices ${field.relaxed ? "choices-relaxed" : ""}`;
      const options = resolveList(field.options);
      if (field.type === "radio" && state.values[field.id] && !options.includes(state.values[field.id])) {
        delete state.values[field.id];
        saveDraft(false);
      }
      options.forEach((option) => {
        const id = `${field.id}_${slug(option)}_${options.indexOf(option)}`;
        const label = document.createElement("label");
        label.className = "choice";
        const input = document.createElement("input");
        input.type = field.type === "radio" ? "radio" : "checkbox";
        input.name = field.id;
        input.id = id;
        input.value = option;
        if (field.type === "radio") input.checked = state.values[field.id] === option;
        else input.checked = Array.isArray(state.values[field.id]) && state.values[field.id].includes(option);
        input.addEventListener("change", onInput);
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        if (field.inlineOtherField?.option === option && input.checked) {
          const otherInput = document.createElement("input");
          otherInput.className = "inline-other";
          otherInput.id = field.inlineOtherField.fieldId;
          otherInput.type = "text";
          otherInput.placeholder = field.inlineOtherField.placeholder || "";
          otherInput.value = state.values[field.inlineOtherField.fieldId] || "";
          otherInput.addEventListener("input", onInput);
          otherInput.addEventListener("click", (event) => event.stopPropagation());
          label.appendChild(otherInput);
        }
        group.appendChild(label);
      });
      return group;
    }

    if (field.type === "checkbox") {
      const label = document.createElement("label");
      label.className = field.agreement ? "choice agreement-choice" : "choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = field.id;
      input.checked = Boolean(state.values[field.id]);
      input.addEventListener("change", onInput);
      label.appendChild(input);
      const text = document.createElement("span");
      text.textContent = field.agreement ? field.label : field.checkboxText || "מאשר";
      label.appendChild(text);
      return label;
    }

    if (field.type === "file") return createFileInput(field);

    const input = document.createElement("input");
    input.id = field.id;
    input.type = field.type;
    if (field.autocomplete) input.autocomplete = field.autocomplete;
    input.disabled = isDisabled(field);
    if (field.defaultValue && state.values[field.id] === undefined) state.values[field.id] = field.defaultValue;
    input.value = state.values[field.id] || field.defaultValue || "";
    if (field.min) input.min = field.min;
    if (field.max) input.max = field.max;
    if (field.type === "date" && field.minAge) input.max = maxBirthDateForAge(field.minAge);
    if (field.type === "date" && field.calendarOnly) {
      input.addEventListener("keydown", (event) => {
        if (["Tab", "Shift", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
      });
      input.addEventListener("paste", (event) => event.preventDefault());
      input.addEventListener("drop", (event) => event.preventDefault());
    }
    input.addEventListener("input", onInput);
    if (field.unit) {
      const inputWrap = document.createElement("div");
      inputWrap.className = "input-with-unit";
      const unit = document.createElement("span");
      unit.className = "input-unit";
      unit.textContent = field.unit;
      inputWrap.appendChild(input);
      inputWrap.appendChild(unit);
      return inputWrap;
    }
    return input;
  }

  function createFileInput(field) {
    const control = document.createElement("div");
    control.className = "file-control";

    const input = document.createElement("input");
    input.id = field.id;
    input.type = "file";
    input.className = "file-picker";
    if (field.multiple) input.multiple = true;
    if (field.accept) input.accept = field.accept;
    input.disabled = isDisabled(field);

    let fileMode = "add";
    input.addEventListener("change", (event) => {
      const selectedFiles = Array.from(event.target.files || []);
      if (!selectedFiles.length) return;

      if (field.multiple) {
        const currentFiles = fileMode === "replace" ? [] : fileList(state.files[field.id]).filter(Boolean);
        state.files[field.id] = [...currentFiles, ...selectedFiles];
      } else {
        state.files[field.id] = selectedFiles[0] || null;
      }

      input.value = "";
      render();
    });

    control.appendChild(input);

    const selectedFiles = fileList(state.files[field.id]).filter(Boolean);
    const hasFiles = selectedFiles.length > 0;

    if (hasFiles) {
      const list = document.createElement("div");
      list.className = "selected-files";

      selectedFiles.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "selected-file";

        const name = document.createElement("span");
        name.className = "selected-file-name";
        name.textContent = `${file.name}${file.size ? ` (${formatFileSize(file.size)})` : ""}`;
        item.appendChild(name);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "file-action file-remove";
        removeButton.textContent = "הסר";
        removeButton.addEventListener("click", () => {
          if (field.multiple) {
            state.files[field.id] = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
          } else {
            state.files[field.id] = null;
          }
          render();
        });
        item.appendChild(removeButton);
        list.appendChild(item);
      });

      control.appendChild(list);
    }

    const actions = document.createElement("div");
    actions.className = "file-actions";

    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.className = "file-action";
    chooseButton.textContent = hasFiles ? "החלף" : field.multiple ? "בחר קבצים" : "בחר קובץ";
    chooseButton.addEventListener("click", () => {
      fileMode = "replace";
      input.click();
    });
    actions.appendChild(chooseButton);

    if (field.multiple && hasFiles) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "file-action";
      addButton.textContent = "הוסף עוד קובץ";
      addButton.addEventListener("click", () => {
        fileMode = "add";
        input.click();
      });
      actions.appendChild(addButton);
    }

    control.appendChild(actions);
    return control;
  }

  function resolveList(value) {
    return typeof value === "function" ? value() : value || [];
  }

  function renderDisclosure(disclosure) {
    return `
      <details class="intro-disclosure">
        <summary>${escapeHtml(disclosure.label)}</summary>
        <div class="intro-disclosure-content">
          <h4>${escapeHtml(disclosure.title)}</h4>
          ${resolveList(disclosure.paragraphs).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          ${
            disclosure.sections?.length
              ? disclosure.sections
                  .map(
                    (section) => `
                      <div class="intro-subsection">
                        <h4>${escapeHtml(section.title)}</h4>
                        ${resolveList(section.paragraphs).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") || ""}
                        ${
                          resolveList(section.items).length
                            ? `<ul>${resolveList(section.items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
                            : ""
                        }
                      </div>
                    `
                  )
                  .join("")
              : ""
          }
        </div>
      </details>
    `;
  }

  function renderContactBox(contactBox) {
    return `
      <div class="intro-contact-box">
        <h4>${escapeHtml(contactBox.title)}</h4>
        ${contactBox.intro ? `<p>${escapeHtml(contactBox.intro)}</p>` : ""}
        <ul>
          ${resolveList(contactBox.items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  function renderDiscountPreview() {
    return `
      <div class="discount-preview" aria-label="תצוגת טופס בקשת הנחה">
        <h4>טופס בקשת הנחה לשכר לימוד - תשפ"ז</h4>
        <p>בקשות ההנחה נבחנות על ידי ועדת ההנחות בהתאם לנתונים ולמסמכים שיוגשו, ומתוך משאבי קרן חירות, הממומנת מכספי הקדש ותרומות. לפיכך, יש למלא את הטופס במדויק ולבקש הנחה בהתאם לצורך האמיתי בלבד.</p>
        <p>כלל הנתונים והמסמכים המוגשים יישמרו בסודיות מלאה, וישמשו את ועדת ההנחות בלבד. הוועדה מתכנסת מדי יום ראשון. לאחר קבלת ההחלטה תישלח אליכם הודעה על גובה ההנחה שאושרה.</p>
        <p>ניתן לצרף מסמכים התומכים בבקשתכם. צירוף מסמכים אינו חובה, אולם הוא עשוי לסייע לוועדת ההנחות להבין טוב יותר את מצבכם הכלכלי ולבחון את בקשתכם בצורה מדויקת יותר.</p>
        <p><strong>את הטופס והמסמכים הנלווים יש לשלוח לכתובת: cherut@kvutze.org</strong></p>

        <div class="discount-preview-grid">
          <span>שם התלמיד: _________________________________</span>
          <span>מקום לימוד בישי"ג: ________________</span>
          <span>מספר תעודת זהות: ___________________________</span>
          <span>אזרחות: __________________________</span>
          <span>שם האב: ___________________________</span>
          <span>עיסוק האב: ______________________________</span>
          <span class="discount-preview-fill">סה"כ הכנסות האב לחודש:<i></i></span>
          <span>שם האם: ___________________________</span>
          <span>עיסוק האם: ______________________________</span>
          <span class="discount-preview-fill">סה"כ הכנסות האם לחודש:<i></i></span>
          <span>מספר ילדים במשפחה - לא נשואים: _______________________</span>
          <span>נשואים: __________________</span>
        </div>

        <p class="discount-preview-note">* יש לפרט את כל מקורות ההכנסה כולל קצבאות, תמיכות קבועות, וכל הכנסה קבועה אחרת.</p>

        <h5>ילדים הלומדים כיום במוסדות שבהם משלמים שכר לימוד</h5>
        <p class="discount-preview-note">כגון: ישי"ק, ישי"ג, סמינר, או מוסד אחר.</p>
        <div class="discount-preview-children">
          ${Array.from({ length: 3 }).map(() => `
            <div class="discount-preview-child">
              <span class="discount-preview-fill">שם הילד:<i></i></span>
              <span class="discount-preview-fill">מוסד הלימודים:<i></i></span>
              <span class="discount-preview-fill">שכ"ל לחודש:<i></i></span>
            </div>
          `).join("")}
        </div>

        <div class="discount-preview-lines">
          <p class="discount-preview-fill">כמה שכר לימוד לחודש שילמתם בשנה שעברה עבור הבחור (בשקל):<i></i></p>
          <p class="discount-preview-fill">כמה שכר לימוד לחודש אתם חושבים שיכולתכם לשלם השנה (בדולר):<i></i></p>
          <p>פרטו את הנסיבות שבגינן אתם מבקשים הנחה בשכר הלימוד:</p>
          <p class="discount-preview-fill discount-preview-fill-wide"><i></i></p>
          <p class="discount-preview-fill discount-preview-fill-wide"><i></i></p>
          <p class="discount-preview-fill discount-preview-fill-wide"><i></i></p>
        </div>
      </div>
    `;
  }

  function tuitionAmounts() {
    const groupYear = state.values.student_group_year || defaultGroupYear;
    if (groupYear !== defaultGroupYear) return { full: 400, discounted: null };
    if (state.values.student_visa_needed !== "כן") return { full: 570, discounted: 300 };
    return { full: 720, discounted: 450 };
  }

  function tuitionMonthsLabel() {
    return formatBillingMonths(tuitionBillingPlan().months);
  }

  function tuitionPeriodText() {
    const plan = tuitionBillingPlan();
    if (!plan.hasCustomDates && plan.groupYear === defaultGroupYear) {
      return `שכר הלימוד מחושב על פני תקופה של ${formatBillingMonths(plan.months)} (מט\"ו אלול תשפ\"ו ועד ז' בחשון תשפ\"ח), ולכן שכר הלימוד הכולל מחושב בהתאם לתקופה זו.`;
    }
    return `שכר הלימוד מחושב לפי תקופת הלימודים בפועל: ${formatDateForDisplay(plan.startDate)} עד ${formatDateForDisplay(plan.endDate)}. לפי כללי החיוב, מספר חודשי החיוב הוא ${formatBillingMonths(plan.months)}.`;
  }

  function tuitionPaymentScheduleItems() {
    const plan = tuitionBillingPlan();
    const items = [
      "הפיקדון נגבה מיד בעת השלמת תהליך הרישום.",
      `מספר חודשי החיוב הכולל הוא ${formatBillingMonths(plan.months)}.`
    ];
    if (plan.schedule.length) {
      items.splice(1, 0, `הגבייה החודשית הראשונה תתבצע ביום ${formatDateForDisplay(plan.firstChargeDate)}.`);
    }
    if (plan.hasPreFirstRegularCharge) {
      items.push(`החיוב עבור התקופה שלפני 01/09/2026 (${billingFactorLabel(plan.preFirstRegularChargeFactor)}) ייגבה יחד עם הפיקדון.`);
    }
    if (plan.schedule.length) {
      items.push(`פירוט החיובים: ${tuitionPaymentScheduleSummary(plan)}.`);
    }
    return items;
  }

  function shouldAskStudyStartDate() {
    const groupYear = state.values.student_group_year || defaultGroupYear;
    return state.values.study_duration === "לא שנה תמימה" || groupYear !== defaultGroupYear;
  }

  function shouldAskStudyEndDate() {
    return state.values.study_duration === "לא שנה תמימה";
  }

  function effectiveStudyStartDate() {
    const groupYear = state.values.student_group_year || defaultGroupYear;
    if (shouldAskStudyStartDate() && state.values.study_start_date) return state.values.study_start_date;
    if (groupYear === "קבוצה תשפ\"ו") return GROUP_5786_FULL_YEAR_START_DATE;
    return DEFAULT_FULL_YEAR_START_DATE;
  }

  function effectiveStudyEndDate() {
    if (shouldAskStudyEndDate() && state.values.study_end_date) return state.values.study_end_date;
    return PROGRAM_END_DATE;
  }

  function tuitionBillingPlan() {
    const groupYear = state.values.student_group_year || defaultGroupYear;
    const startDate = effectiveStudyStartDate();
    const endDate = effectiveStudyEndDate();
    const schedule = billingSchedule(startDate, endDate);
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    const months = start && end && end >= start ? billingMonthsByDuration(start, end) : 0;
    const preFirstRegularChargeFactor = preFirstRegularChargeMonths(start, end, months);
    const regularSchedule = schedule.filter((item) => item.factor > 0);
    return {
      groupYear,
      startDate,
      endDate,
      firstChargeDate: regularSchedule[0]?.chargeDate || "",
      lastChargeDate: regularSchedule[regularSchedule.length - 1]?.chargeDate || "",
      lastChargeFactor: regularSchedule[regularSchedule.length - 1]?.factor || 0,
      months,
      schedule,
      preFirstRegularChargeFactor,
      hasPreFirstRegularCharge: preFirstRegularChargeFactor > 0,
      hasCustomDates: shouldAskStudyStartDate() || shouldAskStudyEndDate()
    };
  }

  function tuitionPaymentSchedulePayload(plan) {
    const parts = [];
    if (plan.hasPreFirstRegularCharge) {
      parts.push(`עם הפיקדון: ${billingFactorLabel(plan.preFirstRegularChargeFactor)} עבור התקופה שלפני 2026-09-01`);
    }
    if (plan.schedule.length) {
      parts.push(tuitionPaymentScheduleSummary(plan));
    }
    return parts.join("; ");
  }

  function tuitionPaymentScheduleSummary(plan) {
    return groupedBillingSchedule(plan.schedule)
      .map((group) => `${formatScheduleGroupRange(group)} - ${billingFactorLabel(group.factor)}`)
      .join("; ");
  }

  function groupedBillingSchedule(schedule) {
    return schedule.reduce((groups, item) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.factor === item.factor && areConsecutiveMonths(lastGroup.endMonth, item.month)) {
        lastGroup.endMonth = item.month;
        return groups;
      }
      groups.push({ startMonth: item.month, endMonth: item.month, factor: item.factor });
      return groups;
    }, []);
  }

  function areConsecutiveMonths(first, second) {
    const firstDate = parseLocalDate(first);
    const secondDate = parseLocalDate(second);
    if (!firstDate || !secondDate) return false;
    return toDateInputValue(addMonths(firstDate, 1)) === toDateInputValue(secondDate);
  }

  function formatScheduleGroupRange(group) {
    const start = formatMonthForDisplay(group.startMonth);
    const end = formatMonthForDisplay(group.endMonth);
    return start === end ? start : `${start}-${end}`;
  }

  function billingSchedule(startDateValue, endDateValue) {
    const start = parseLocalDate(startDateValue);
    const end = parseLocalDate(endDateValue);
    if (!start || !end || end < start) return [];

    const totalMonths = billingMonthsByDuration(start, end);
    const regularMonths = Math.max(0, Number((totalMonths - preFirstRegularChargeMonths(start, end, totalMonths)).toFixed(2)));
    const fullMonths = Math.floor(regularMonths);
    const fractionalMonth = Number((regularMonths - fullMonths).toFixed(2));
    const scheduleStartMonth = maxDate(firstDayOfMonth(start), parseLocalDate(FIRST_REGULAR_TUITION_CHARGE_DATE));
    const schedule = [];

    for (let index = 0; index < fullMonths; index += 1) {
      const month = addMonths(scheduleStartMonth, index);
      schedule.push({
        month: toDateInputValue(month),
        chargeDate: toDateInputValue(month),
        factor: 1
      });
    }

    if (fractionalMonth > 0) {
      const month = addMonths(scheduleStartMonth, fullMonths);
      schedule.push({
        month: toDateInputValue(month),
        chargeDate: toDateInputValue(month),
        factor: fractionalMonth
      });
    }

    return schedule;
  }

  function preFirstRegularChargeMonths(start, end, totalMonths) {
    const firstRegularCharge = parseLocalDate(FIRST_REGULAR_TUITION_CHARGE_DATE);
    if (!start || !end || start >= firstRegularCharge) return 0;
    if (
      toDateInputValue(start) === DEFAULT_FULL_YEAR_START_DATE &&
      toDateInputValue(end) === PROGRAM_END_DATE
    ) {
      return Math.min(0.5, totalMonths);
    }
    const preRegularEnd = minDate(end, firstRegularCharge);
    const preRegularDays = Math.max(0, daysBetween(start, preRegularEnd));
    const preRegularMonths = preRegularDays > 0 ? Math.ceil(preRegularDays / 7) * 0.25 : 0;
    return Math.min(preRegularMonths, totalMonths);
  }

  function billingMonthsByDuration(start, end) {
    if (
      toDateInputValue(start) === DEFAULT_FULL_YEAR_START_DATE &&
      toDateInputValue(end) === PROGRAM_END_DATE
    ) {
      return 14.5;
    }
    const wholeMonths = wholeCalendarMonthsBetween(start, end);
    const anchor = addCalendarMonthsClamped(start, wholeMonths);
    const extraDays = Math.max(0, daysBetween(anchor, end));
    const extraMonths = extraDays > 0 ? Math.ceil(extraDays / 7) * 0.25 : 0;

    return wholeMonths + extraMonths;
  }

  function billingFactorLabel(factor) {
    if (factor === 1) return "חיוב מלא";
    return formatBillingMonths(factor);
  }

  function maxDate(first, second) {
    return first > second ? first : second;
  }

  function minDate(first, second) {
    return first < second ? first : second;
  }

  function wholeCalendarMonthsBetween(start, end) {
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const anchor = addCalendarMonthsClamped(start, months);
    if (anchor > end) months -= 1;
    return Math.max(0, months);
  }

  function addCalendarMonthsClamped(date, count) {
    const target = new Date(date.getFullYear(), date.getMonth() + count, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(date.getDate(), lastDay));
    return target;
  }

  function daysBetween(start, end) {
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((endUtc - startUtc) / 86400000);
  }

  function parseLocalDate(value) {
    if (!value) return null;
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function firstDayOfMonth(value) {
    const date = value instanceof Date ? value : parseLocalDate(value);
    return date ? new Date(date.getFullYear(), date.getMonth(), 1) : null;
  }

  function addMonths(value, count) {
    const date = value instanceof Date ? value : parseLocalDate(value);
    return new Date(date.getFullYear(), date.getMonth() + count, 1);
  }

  function sameMonth(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function toDateInputValue(date) {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatBillingMonths(value) {
    const normalized = Number(Number(value || 0).toFixed(2));
    const wholeMonths = Math.floor(normalized);
    const weekFactor = Number((normalized - wholeMonths).toFixed(2));
    const parts = [];

    if (wholeMonths > 0) {
      parts.push(formatWholeMonths(wholeMonths));
    }
    if (weekFactor > 0) {
      const weekLabel = billingWeekLabel(weekFactor, wholeMonths === 0);
      parts.push(wholeMonths > 0 ? `ו${weekLabel}` : weekLabel);
    }

    return parts.length ? parts.join(" ") : "0 חודשים";
  }

  function billingNumberValue(value) {
    return Number(Number(value || 0).toFixed(2));
  }

  function formatWholeMonths(value) {
    if (value === 1) return "חודש אחד";
    return `${value} חודשים`;
  }

  function billingWeekLabel(factor, standalone = false) {
    if (factor === 0.25) return standalone ? "שבוע אחד" : "שבוע";
    if (factor === 0.5) return "שבועיים";
    if (factor === 0.75) return "שלושה שבועות";
    return `${factor} חודש`;
  }

  function formatDateForDisplay(value) {
    const date = parseLocalDate(value);
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  }

  function formatMonthForDisplay(value) {
    const date = parseLocalDate(value);
    if (!date) return "";
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  }

  function tuitionDiscountOptions() {
    const amounts = tuitionAmounts();
    const months = tuitionMonthsLabel();
    const fullOption =
      (state.values.student_group_year || defaultGroupYear) === defaultGroupYear
        ? `עלות בחור מליאה - ${amounts.full} דולר לחודש (כפול ${months}).`
        : `${amounts.full} דולר לחודש (כפול ${months}).`;
    const additionalDiscount = additionalDiscountOption;
    if (amounts.discounted == null) return [fullOption, additionalDiscount];
    return [
      fullOption,
      `אני מבקש את ההנחה הבסיסית – שכר לימוד של ${amounts.discounted} דולר לחודש (כפול ${months}).`,
      additionalDiscount
    ];
  }

  function createSignatureInput(field) {
    const wrap = document.createElement("div");
    wrap.className = "signature-pad";

    const canvas = document.createElement("canvas");
    canvas.id = field.id;
    canvas.width = 900;
    canvas.height = 260;
    canvas.setAttribute("aria-label", field.label);
    wrap.appendChild(canvas);

    const actions = document.createElement("div");
    actions.className = "signature-actions";

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "secondary";
    clear.textContent = "נקה חתימה";
    actions.appendChild(clear);
    wrap.appendChild(actions);

    setupSignatureCanvas(canvas, field.id);
    clear.addEventListener("click", () => {
      clearSignatureCanvas(canvas, field.id);
      saveDraft(false);
    });

    return wrap;
  }

  function setupSignatureCanvas(canvas, fieldId) {
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#17211f";

    let drawing = false;
    let last = null;

    if (state.values[fieldId]) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = state.values[fieldId];
    }

    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      const clientX = touch ? touch.clientX : event.clientX;
      const clientY = touch ? touch.clientY : event.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height
      };
    };

    const start = (event) => {
      event.preventDefault();
      drawing = true;
      last = point(event);
    };

    const move = (event) => {
      if (!drawing) return;
      event.preventDefault();
      const next = point(event);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      last = next;
    };

    const end = (event) => {
      if (!drawing) return;
      event.preventDefault();
      drawing = false;
      state.values[fieldId] = canvas.toDataURL("image/png");
      state.signatures[fieldId] = state.values[fieldId];
      saveDraft(false);
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end, { passive: false });
  }

  function clearSignatureCanvas(canvas, fieldId) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    delete state.values[fieldId];
    delete state.signatures[fieldId];
  }

  function onInput(event) {
    const target = event.target;
    const field = target.name || target.id;

    if (target.type === "checkbox" && target.name) {
      const selected = Array.from(document.querySelectorAll(`input[name="${field}"]:checked`)).map((x) => x.value);
      state.values[field] = normalizeCheckboxSelection(field, selected, target.value);
      applyInlineOtherRules(field, selected);
    } else if (target.type === "checkbox") {
      state.values[field] = target.checked;
    } else if (target.type === "radio") {
      state.values[field] = target.value;
      applyInlineOtherRules(field, target.value);
    } else {
      state.values[field] = target.value;
    }

    applyLinkedFieldRules(field);
    invalidateExistingPaymentWhenIdentityChanges(field);
    saveDraft(false);
    updateDynamicLabels();

    if (visibilityControllerIds.has(field) || ["student_group_year", "study_duration"].includes(field) || fieldConfig(field)?.inlineOtherField) {
      renderFields(steps[state.stepIndex]);
    }
  }

  function normalizeCheckboxSelection(field, selected, changedValue) {
    const configField = fieldConfig(field);
    if (!configField?.detailsWhenAnyExcept) return selected;
    const noneValue = configField.detailsWhenAnyExcept;
    if (changedValue === noneValue && selected.includes(noneValue)) return [noneValue];
    return selected.filter((value) => value !== noneValue);
  }

  function applyInlineOtherRules(field, selected) {
    const configField = fieldConfig(field);
    const inline = configField?.inlineOtherField;
    if (!inline) return;
    const isSelected = Array.isArray(selected) ? selected.includes(inline.option) : selected === inline.option;
    if (!isSelected) {
      state.values[inline.fieldId] = "";
    }
  }

  function fieldConfig(fieldId) {
    return steps.flatMap((step) => step.fields).find((item) => item.id === fieldId);
  }

  function createPaymentPanel(field) {
    const panel = document.createElement("div");
    panel.className = "payment-panel";

    const status = state.values.registration_payment_status;
    const sessionId = state.values.registration_payment_session_id;
    const paid = isRegistrationPaymentPaid();
    const verifying = status === "verifying";
    const failed = status === "failed";
    const cancelled = status === "cancelled";
    const devSkipped = status === "dev_skipped";
    const alreadyPaid = status === "already_paid";
    const checkingExisting = status === "existing_verifying";
    const existingFailed = status === "existing_failed";

    const title = devSkipped ? "התשלום דולג לצורך בדיקה" : alreadyPaid ? "נמצא תשלום קודם" : paid ? "התשלום התקבל" : verifying || checkingExisting ? "בודק את אישור התשלום..." : "תשלום דמי הרשמה";
    const description = devSkipped
      ? "מצב בדיקות פעיל כרגע, ולכן אפשר להמשיך לסיכום בלי לשלם בפועל. בפרסום אמיתי נכבה את האפשרות הזו."
      : alreadyPaid
        ? "מצאנו תשלום דמי הרשמה קודם לפי הפרטים שהוזנו. ניתן להמשיך לשלב הבא."
      : paid
        ? `דמי ההרשמה בסך ${field.amountUsd} דולר שולמו בהצלחה. ניתן להמשיך לשלב הבא.`
        : verifying || checkingExisting
          ? "אנחנו מאמתים מול Stripe שהתשלום עבר בהצלחה. זה אמור לקחת כמה שניות."
          : `יש לשלם ${field.amountUsd} דולר כדי להמשיך לסיכום ושליחת הטופס.`;

    panel.innerHTML = `
      <div class="payment-panel-content">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
        ${failed ? `<span class="payment-warning">לא הצלחנו לאמת את התשלום. אם חויבתם, אפשר לבדוק שוב או לפנות למשרד.</span>` : ""}
        ${cancelled ? `<span class="payment-warning">התשלום בוטל. ניתן לנסות שוב.</span>` : ""}
        ${existingFailed ? `<span class="payment-warning">לא נמצא תשלום קודם לפי הפרטים שהוזנו.</span>` : ""}
      </div>
    `;

    if (DEV_SKIP_PAYMENT_VALIDATION && !paid && !verifying) {
      const skipButton = document.createElement("button");
      skipButton.type = "button";
      skipButton.className = "payment-button secondary-payment-button";
      skipButton.textContent = "דלג לתשלום לצורך בדיקה";
      skipButton.addEventListener("click", skipRegistrationPaymentForDev);
      panel.appendChild(skipButton);
    }

    if (failed && sessionId) {
      const retryButton = document.createElement("button");
      retryButton.type = "button";
      retryButton.className = "payment-button secondary-payment-button";
      retryButton.textContent = "בדוק שוב את התשלום";
      retryButton.addEventListener("click", () => retryRegistrationPaymentVerification(sessionId, retryButton));
      panel.appendChild(retryButton);
    }

    if (!paid && !verifying) {
      const actions = document.createElement("div");
      actions.className = "payment-actions";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "payment-button registration-payment-start";
      button.textContent = "לתשלום מאובטח ב-Stripe";
      button.addEventListener("click", () => startRegistrationPayment(field, button));
      actions.appendChild(button);

      if (!checkingExisting) {
        const alreadyPaidButton = document.createElement("button");
        alreadyPaidButton.type = "button";
        alreadyPaidButton.className = "payment-button secondary-payment-button compact-payment-button";
        alreadyPaidButton.textContent = "שילמתי כבר";
        alreadyPaidButton.addEventListener("click", openExistingPaymentLookup);
        actions.appendChild(alreadyPaidButton);
      }

      panel.appendChild(actions);
    }

    if (!verifying && shouldShowExistingPaymentLookup()) {
      panel.appendChild(createAlreadyPaidBox());
    }

    return panel;
  }

  function createAlreadyPaidBox() {
    const box = document.createElement("div");
    const active = shouldShowExistingPaymentLookup();
    const checking = state.values.registration_payment_status === "existing_verifying";
    box.className = `already-paid-box${active ? " is-active" : ""}`;

    box.innerHTML = `
      <div class="already-paid-header">
        <div>
          <strong>כבר שילמתי דמי הרשמה</strong>
          <span>המערכת תבדוק אם קיים תשלום קודם לפי תאריך הלידה ושם המשפחה באנגלית של התלמיד בטופס.</span>
        </div>
        <button type="button" class="payment-button secondary-payment-button already-paid-cancel">בטל</button>
      </div>
      <div class="already-paid-fields">
        <label>
          <span>תאריך לידה לועזי</span>
          <input type="date" value="${escapeHtml(state.values.birth_date || "")}" disabled>
        </label>
        <label>
          <span>שם משפחה באנגלית</span>
          <input type="text" dir="ltr" value="${escapeHtml(state.values.student_last_name_en || "")}" disabled>
        </label>
      </div>
      <button type="button" class="payment-button already-paid-verify">${checking ? "בודק..." : "בדוק תשלום קודם"}</button>
    `;

    box.querySelector(".already-paid-cancel").addEventListener("click", () => {
      clearExistingPaymentLookup();
      saveDraft(false);
      render();
    });

    const verifyButton = box.querySelector(".already-paid-verify");
    verifyButton.disabled = checking;
    verifyButton.addEventListener("click", () => verifyExistingRegistrationPayment(verifyButton));

    return box;
  }

  function openExistingPaymentLookup() {
    state.values.registration_payment_status = "existing_lookup";
    state.values.registration_payment_session_id = "";
    setExistingPaymentLookupFromCurrentStudent();
    saveDraft(false);
    render();
  }

  function clearExistingPaymentLookup() {
    state.values.registration_payment_status = "";
    state.values.registration_payment_session_id = "";
    state.values.registration_payment_paid_at = null;
    state.values.registration_payment_existing_birth_date = "";
    state.values.registration_payment_existing_last_name_en = "";
  }

  function setExistingPaymentLookupFromCurrentStudent() {
    state.values.registration_payment_existing_birth_date = state.values.birth_date || "";
    state.values.registration_payment_existing_last_name_en = state.values.student_last_name_en || "";
  }

  function existingPaymentLookupMatchesCurrentStudent() {
    return (
      state.values.registration_payment_existing_birth_date === (state.values.birth_date || "") &&
      normalizePaymentLookupValue(state.values.registration_payment_existing_last_name_en) === normalizePaymentLookupValue(state.values.student_last_name_en)
    );
  }

  function invalidateExistingPaymentWhenIdentityChanges(field) {
    if (!["birth_date", "student_last_name_en"].includes(field)) return;

    if (["already_paid", "existing_lookup", "existing_verifying", "existing_failed"].includes(state.values.registration_payment_status)) {
      state.values.registration_payment_status = "existing_lookup";
      state.values.registration_payment_session_id = "";
      state.values.registration_payment_paid_at = null;
      setExistingPaymentLookupFromCurrentStudent();
    }
  }

  function normalizePaymentLookupValue(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function hasAlreadyPaidLookupDetails() {
    return Boolean(state.values.birth_date && state.values.student_last_name_en);
  }

  function shouldShowExistingPaymentLookup() {
    return ["existing_lookup", "existing_verifying", "existing_failed", "already_paid"].includes(state.values.registration_payment_status);
  }

  function skipRegistrationPaymentForDev() {
    state.values.registration_payment_status = "dev_skipped";
    state.values.registration_payment_session_id = "dev-skip";
    state.values.registration_payment_amount_usd = 10;
    state.values.registration_payment_paid_at = null;
    saveDraft(false);
    render();
  }

  async function startRegistrationPayment(field, button = document.querySelector(".registration-payment-start")) {
    if (button) {
      button.disabled = true;
      button.textContent = "מעביר לתשלום...";
    }
    formError.textContent = "";

    try {
      saveDraft(false);
      const response = await fetch("/.netlify/functions/create-registration-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: field.amountUsd,
          studentEmail: stripeCustomerEmail(),
          studentName: `${state.values.student_first_name_en || state.values.student_first_name_he || ""} ${state.values.student_last_name_en || state.values.student_last_name_he || ""}`.trim(),
          birthDate: state.values.birth_date || "",
          lastNameEn: state.values.student_last_name_en || ""
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.url) {
        throw new Error(result.error || "לא ניתן לפתוח את עמוד התשלום כרגע.");
      }

      state.values.registration_payment_status = "pending";
      state.values.registration_payment_session_id = result.id || "";
      saveDraft(false);
      window.location.href = result.url;
    } catch (error) {
      formError.textContent = error.message || "פתיחת התשלום נכשלה.";
      if (button) {
        button.disabled = false;
        button.textContent = "לתשלום מאובטח ב-Stripe";
      }
    }
  }

  async function handlePaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");
    if (!payment) return;

    const paymentStepIndex = steps.findIndex((step) => step.id === "registration_payment");
    if (paymentStepIndex >= 0) state.stepIndex = paymentStepIndex;

    if (payment === "registration_cancelled") {
      state.values.registration_payment_status = "cancelled";
      saveDraft(false);
      cleanPaymentUrl();
      render();
      return;
    }

    if (payment === "registration_success" && sessionId) {
      state.values.registration_payment_status = "verifying";
      state.values.registration_payment_session_id = sessionId;
      saveDraft(false);
      cleanPaymentUrl();
      render();

      try {
        const verified = await verifyRegistrationPayment(sessionId);
        state.values.registration_payment_status = verified.paid ? "paid" : "failed";
        state.values.registration_payment_paid_at = verified.paid ? verified.paidAt || new Date().toISOString() : null;
        state.values.registration_payment_amount_usd = typeof verified.amountUsd === "number" ? verified.amountUsd : 10;
      } catch {
        state.values.registration_payment_status = "failed";
        state.values.registration_payment_paid_at = null;
      }

      saveDraft(false);
      render();
    }
  }

  async function retryRegistrationPaymentVerification(sessionId, button) {
    if (button) {
      button.disabled = true;
      button.textContent = "בודק שוב...";
    }
    state.values.registration_payment_status = "verifying";
    saveDraft(false);
    render();

    try {
      const verified = await verifyRegistrationPayment(sessionId);
      state.values.registration_payment_status = verified.paid ? "paid" : "failed";
      state.values.registration_payment_paid_at = verified.paid ? verified.paidAt || new Date().toISOString() : null;
      state.values.registration_payment_amount_usd = typeof verified.amountUsd === "number" ? verified.amountUsd : 10;
    } catch {
      state.values.registration_payment_status = "failed";
      state.values.registration_payment_paid_at = null;
    }

    saveDraft(false);
    render();
  }

  async function verifyRegistrationPayment(sessionId) {
    const response = await fetch(`/.netlify/functions/verify-registration-payment?session_id=${encodeURIComponent(sessionId)}`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "אימות התשלום נכשל.");
    return result;
  }

  async function verifyExistingRegistrationPayment(button) {
    formError.textContent = "";
    setExistingPaymentLookupFromCurrentStudent();

    if (!hasAlreadyPaidLookupDetails()) {
      formError.textContent = "יש למלא תאריך לידה לועזי ושם משפחה באנגלית.";
      return false;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "בודק...";
    }
    state.values.registration_payment_status = "existing_verifying";
    saveDraft(false);
    render();

    try {
      const response = await fetch("/.netlify/functions/verify-existing-registration-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: state.values.birth_date,
          lastNameEn: state.values.student_last_name_en
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.paid) throw new Error(result.error || "לא נמצא תשלום קודם.");
      if (!existingPaymentResultMatchesCurrentStudent(result)) throw new Error("התשלום שנמצא אינו תואם לפרטי התלמיד בטופס.");

      state.values.registration_payment_status = "already_paid";
      state.values.registration_payment_session_id = result.paymentIntentId || result.sessionId || "existing-payment";
      state.values.registration_payment_amount_usd = typeof result.amountUsd === "number" ? result.amountUsd : 10;
      state.values.registration_payment_paid_at = result.paidAt || null;
      saveDraft(false);
      render();
      return true;
    } catch (error) {
      state.values.registration_payment_status = "existing_failed";
      state.values.registration_payment_session_id = "";
      state.values.registration_payment_paid_at = null;
      saveDraft(false);
      render();
      formError.textContent = error.message || "לא נמצא תשלום קודם לפי הפרטים שהוזנו.";
      return false;
    }
  }

  function cleanPaymentUrl() {
    window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
  }

  function isRegistrationPaymentPaid() {
    if (DEV_SKIP_PAYMENT_VALIDATION && state.values.registration_payment_status === "dev_skipped") return true;
    if (state.values.registration_payment_status === "already_paid") {
      return Boolean(state.values.registration_payment_session_id) && existingPaymentLookupMatchesCurrentStudent();
    }
    return state.values.registration_payment_status === "paid" && Boolean(state.values.registration_payment_session_id);
  }

  function existingPaymentResultMatchesCurrentStudent(result) {
    if (!result.birthDate && !result.lastNameEn) return true;
    return (
      result.birthDate === (state.values.birth_date || "") &&
      normalizePaymentLookupValue(result.lastNameEn) === normalizePaymentLookupValue(state.values.student_last_name_en)
    );
  }

  function nextStep() {
    if (!validateStep()) return;
    if (state.returnToReviewFromStep === steps[state.stepIndex].id) {
      state.stepIndex = steps.findIndex((step) => step.id === "review");
      state.returnToReviewFromStep = null;
    } else {
      state.stepIndex = nextVisibleStepIndex(state.stepIndex);
    }
    saveDraft(false);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    state.returnToReviewFromStep = null;
    state.stepIndex = previousVisibleStepIndex(state.stepIndex);
    saveDraft(false);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(stepId) {
    const index = steps.findIndex((step) => step.id === stepId);
    if (index < 0) return;
    state.returnToReviewFromStep = steps[state.stepIndex]?.isReview ? stepId : null;
    state.stepIndex = index;
    saveDraft(false);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stepHasVisibleFields(step) {
    if (step.isReview) return true;
    return step.fields.some((field) => field.type !== "section" && isVisible(field));
  }

  function ensureVisibleStep() {
    if (stepHasVisibleFields(steps[state.stepIndex])) return;
    state.stepIndex = nextVisibleStepIndex(state.stepIndex);
  }

  function nextVisibleStepIndex(fromIndex) {
    for (let index = fromIndex + 1; index < steps.length; index += 1) {
      if (stepHasVisibleFields(steps[index])) return index;
    }
    return fromIndex;
  }

  function previousVisibleStepIndex(fromIndex) {
    for (let index = fromIndex - 1; index >= 0; index -= 1) {
      if (stepHasVisibleFields(steps[index])) return index;
    }
    return fromIndex;
  }

  function visibleProgress() {
    const visibleSteps = steps.filter(stepHasVisibleFields);
    const currentStep = steps[state.stepIndex];
    return {
      current: Math.max(1, visibleSteps.indexOf(currentStep) + 1),
      total: Math.max(1, visibleSteps.length)
    };
  }

  function validateStep() {
    clearErrors();
    const step = steps[state.stepIndex];
    let valid = true;

    step.fields.forEach((field) => {
      if (!isVisible(field)) return;
      const value = state.values[field.id];
      if (isDisabled(field)) return;

      if (!DEV_SKIP_REQUIRED_VALIDATION && field.type !== "payment" && field.required && isEmpty(value) && !hasFileValue(state.files[field.id])) {
        setError(field.id, "שדה חובה");
        valid = false;
      }

      if (!DEV_SKIP_REQUIRED_VALIDATION && field.type === "checkbox" && field.required && value !== true) {
        setError(field.id, "יש לסמן אישור לפני המשך");
        valid = false;
      }

      if (!DEV_SKIP_REQUIRED_VALIDATION && field.type === "signature" && field.required && !state.values[field.id]) {
        setError(field.id, "יש לחתום לפני המשך");
        valid = false;
      }

      if (field.type === "payment" && field.required && (!DEV_SKIP_PAYMENT_VALIDATION || shouldShowExistingPaymentLookup()) && !isRegistrationPaymentPaid()) {
        setError(field.id, shouldShowExistingPaymentLookup() ? "יש לבדוק את התשלום הקודם לפני המשך." : "יש להשלים את תשלום דמי ההרשמה לפני המשך.");
        valid = false;
      }

      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError(field.id, "כתובת אימייל לא תקינה");
        valid = false;
      }

      if (field.emailOrNone && value && !isEmailOrNone(value)) {
        setError(field.id, "יש לכתוב כתובת אימייל תקינה או: אין לי");
        valid = false;
      }

      if (field.israeliId && value && !isValidIsraeliId(value)) {
        setError(field.id, "מספר תעודת הזהות אינו תקין");
        valid = false;
      }

      if (field.type === "date" && field.minAge && value && !isAtLeastAge(value, field.minAge)) {
        setError(field.id, `תאריך הלידה חייב להיות לפני גיל ${field.minAge} לפחות`);
        valid = false;
      }

      if (field.type === "date" && field.min && value && parseLocalDate(value) < parseLocalDate(field.min)) {
        setError(field.id, `לא ניתן לבחור תאריך לפני ${formatDateForDisplay(field.min)}`);
        valid = false;
      }

      if (field.id === "study_end_date" && value && state.values.study_start_date && parseLocalDate(value) < parseLocalDate(state.values.study_start_date)) {
        setError(field.id, "תאריך הסיום חייב להיות אחרי תאריך ההתחלה");
        valid = false;
      }

      if (
        field.inlineOtherField &&
        ((Array.isArray(value) && value.includes(field.inlineOtherField.option)) || value === field.inlineOtherField.option)
      ) {
        const otherValue = state.values[field.inlineOtherField.fieldId];
        if (isEmpty(otherValue)) {
          setError(field.id, "יש למלא את הפירוט");
          valid = false;
        }
      }

      if (field.matches && value !== state.values[field.matches]) {
        setError(field.id, "האימיילים אינם זהים");
        valid = false;
      }
    });

    if (!valid) formError.textContent = "יש לתקן את השדות המסומנים לפני המשך.";
    return valid;
  }

  function missingRequiredFiles() {
    const missing = [];
    steps.forEach((step) => {
      if (step.isReview || !stepHasVisibleFields(step)) return;
      step.fields.forEach((field) => {
        if (field.type !== "file" || !field.required || !isVisible(field) || isDisabled(field)) return;
        if (!hasFileValue(state.files[field.id])) missing.push({ step, field });
      });
    });
    return missing;
  }

  function goToMissingRequiredFile(missingFile) {
    state.stepIndex = steps.findIndex((step) => step.id === missingFile.step.id);
    state.returnToReviewFromStep = missingFile.step.id;
    saveDraft(false);
    render();
    formError.textContent = "הקובץ לא נשמר לאחר רענון הדף. יש לצרף אותו מחדש לפני השליחה.";
    setError(missingFile.field.id, "יש לצרף את הקובץ מחדש");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitRegistration(event) {
    event.preventDefault();
    if (!validateStep()) return;

    const missingFile = missingRequiredFiles()[0];
    if (missingFile) {
      goToMissingRequiredFile(missingFile);
      return;
    }

    const paymentOk = await ensureRegistrationPaymentVerified();
    if (!paymentOk) return;

    const hasGoogleWebhook = config.GOOGLE_APPS_SCRIPT_URL && !config.GOOGLE_APPS_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID");
    const hasSupabase =
      config.SUPABASE_URL &&
      config.SUPABASE_ANON_KEY &&
      !config.SUPABASE_URL.includes("YOUR_PROJECT");

    if (!hasGoogleWebhook && !hasSupabase) {
      formError.textContent = "חסר חיבור. יש להגדיר GOOGLE_APPS_SCRIPT_URL או פרטי Supabase בקובץ config.js.";
      return;
    }

    submitBtn.disabled = true;
    startSubmissionProgress();
    submitBtn.textContent = "שולח...";

    try {
      const payload = buildPayload();

      if (hasGoogleWebhook) {
        await submitToGoogle(payload);
        clearDraftStorage();
        showSuccess();
        return;
      }

      setSubmissionProgress(2);
      const registration = await supabaseFetch("/rest/v1/registrations", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload)
      });

      const registrationId = registration[0].id;
      setSubmissionProgress(3);
      await uploadAllFiles(registrationId);
      clearDraftStorage();
      finishSubmissionProgress();
      showSuccess();
    } catch (error) {
      stopSubmissionProgress();
      formError.textContent = error.message || "השליחה נכשלה. נסה שוב.";
      submitBtn.disabled = false;
      submitBtn.textContent = "שלח הרשמה";
    }
  }

  async function ensureRegistrationPaymentVerified() {
    if (DEV_SKIP_PAYMENT_VALIDATION && state.values.registration_payment_status === "dev_skipped") return true;
    if (
      state.values.registration_payment_status === "already_paid" &&
      state.values.registration_payment_session_id &&
      existingPaymentLookupMatchesCurrentStudent()
    ) {
      return true;
    }

    const paymentStepIndex = steps.findIndex((step) => step.id === "registration_payment");
    if (!isRegistrationPaymentPaid()) {
      if (paymentStepIndex >= 0) {
        state.stepIndex = paymentStepIndex;
        saveDraft(false);
        render();
      }
      formError.textContent = "יש להשלים את תשלום דמי ההרשמה לפני שליחת הטופס.";
      return false;
    }

    try {
      const verified = await verifyRegistrationPayment(state.values.registration_payment_session_id);
      if (verified.paid) {
        state.values.registration_payment_status = "paid";
        state.values.registration_payment_paid_at = verified.paidAt || state.values.registration_payment_paid_at || new Date().toISOString();
        state.values.registration_payment_amount_usd = typeof verified.amountUsd === "number" ? verified.amountUsd : 10;
        saveDraft(false);
        return true;
      }
    } catch {
      // The message below is clearer for the user than the technical failure.
    }

    state.values.registration_payment_status = "failed";
    state.values.registration_payment_paid_at = null;
    saveDraft(false);
    if (paymentStepIndex >= 0) {
      state.stepIndex = paymentStepIndex;
      render();
    }
    formError.textContent = "לא הצלחנו לאמת את התשלום מול Stripe. לא ניתן לשלוח את הטופס לפני אימות תשלום.";
    return false;
  }

  async function submitToGoogle(payload) {
    setSubmissionProgress(1);
    const files = await collectFilesForGoogle();
    const googlePayload = googleCompatiblePayload(payload);
    setSubmissionProgress(2);
    const response = await fetch(config.GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        payload: googlePayload,
        files
      })
    });
    setSubmissionProgress(4);

    if (!response.ok) {
      throw new Error("השליחה ל-Google נכשלה.");
    }

    const result = await response.json().catch(() => ({}));
    if (!result?.ok) {
      throw new Error(result?.error || "השליחה ל-Google נכשלה.");
    }
    finishSubmissionProgress();
    return result;
  }

  function googleCompatiblePayload(payload) {
    const copy = { ...payload };
    [
      "citizenship_other",
      "parents_street",
      "parents_city",
      "parents_state",
      "parents_zip",
      "father_address_not_relevant",
      "father_street",
      "father_city",
      "father_state",
      "father_zip",
      "mother_address_not_relevant",
      "mother_street",
      "mother_city",
      "mother_state",
      "mother_zip",
      "tuition_deposit_charge_factor",
      "tuition_last_charge_date",
      "tuition_last_charge_factor"
    ].forEach((fieldId) => {
      delete copy[fieldId];
    });
    return copy;
  }

  function startSubmissionProgress() {
    setSubmissionProgress(0);
    let stepIndex = 0;
    clearInterval(submissionProgressTimer);
    submissionProgressTimer = setInterval(() => {
      stepIndex = Math.min(stepIndex + 1, submissionProgressSteps.length - 1);
      setSubmissionProgress(stepIndex);
      if (stepIndex >= submissionProgressSteps.length - 1) {
        clearInterval(submissionProgressTimer);
        submissionProgressTimer = null;
      }
    }, 4500);
  }

  function setSubmissionProgress(stepIndex) {
    const step = submissionProgressSteps[Math.max(0, Math.min(stepIndex, submissionProgressSteps.length - 1))];
    submissionProgress?.classList.remove("hidden");
    if (submissionProgressTitle) submissionProgressTitle.textContent = step.title;
    if (submissionProgressPercent) submissionProgressPercent.textContent = `${step.percent}%`;
    if (submissionProgressBar) submissionProgressBar.style.width = `${step.percent}%`;
  }

  function finishSubmissionProgress() {
    clearInterval(submissionProgressTimer);
    submissionProgressTimer = null;
    if (submissionProgressTitle) submissionProgressTitle.textContent = "השליחה הושלמה בהצלחה.";
    if (submissionProgressPercent) submissionProgressPercent.textContent = "100%";
    if (submissionProgressBar) submissionProgressBar.style.width = "100%";
  }

  function stopSubmissionProgress() {
    clearInterval(submissionProgressTimer);
    submissionProgressTimer = null;
    submissionProgress?.classList.add("hidden");
    if (submissionProgressBar) submissionProgressBar.style.width = "0";
    if (submissionProgressPercent) submissionProgressPercent.textContent = "0%";
  }

  async function collectFilesForGoogle() {
    const entries = Object.entries(state.files).filter(([, file]) => hasFileValue(file));
    const files = [];

    for (const [fieldId, fileValue] of entries) {
      for (const file of fileList(fileValue)) {
        files.push({
          field_id: fieldId,
          name: file.name,
          type: file.type || "application/octet-stream",
          data: await fileToBase64(file)
        });
      }
    }

    Object.entries(state.values)
      .filter(([fieldId, value]) => fieldId.endsWith("_signature") && typeof value === "string" && value.startsWith("data:image/png;base64,"))
      .forEach(([fieldId, value]) => {
        files.push({
          field_id: fieldId,
          name: `${fieldId}.png`,
          type: "image/png",
          data: value.split(",")[1]
        });
      });

    return files;
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function buildPayload() {
    const values = state.values;
    const selectedGroup = values.student_group_year || defaultGroupYear;
    const billingPlan = tuitionBillingPlan();
    const yeshiva5786 = yeshivaValue("5786");
    const yeshiva5785 = values.same_yeshiva_3_years ? yeshiva5786 : yeshivaValue("5785");
    const yeshiva5784 = values.same_yeshiva_3_years ? yeshiva5786 : yeshivaValue("5784");
    const responseEmail = responseEmailValue();

    return {
      status: "submitted",
      kind: "sleeping_place",
      response_recipient: responseRecipient(values.response_recipient),
      student_last_name_he: values.student_last_name_he,
      student_first_name_he: values.student_first_name_he,
      student_last_name_en: values.student_last_name_en,
      student_first_name_en: values.student_first_name_en,
      birth_date_he: values.birth_date_he || null,
      birth_date: values.birth_date,
      birth_city: values.birth_city || null,
      birth_country: values.birth_country || null,
      birth_zip: values.birth_zip || null,
      student_group_year: selectedGroup,
      yeshiva_before_group: yeshivaBeforeGroupValue(),
      yeshiva_after_group: yeshivaAfterGroupValue(),
      yeshiva_name: yeshiva5786,
      yeshiva_other: null,
      yeshiva_5786: yeshiva5786,
      yeshiva_5786_other: null,
      yeshiva_5785: yeshiva5785,
      yeshiva_5785_other: null,
      yeshiva_5784: yeshiva5784,
      yeshiva_5784_other: null,
      student_email: values.student_email,
      student_phone: values.student_phone || null,
      citizenships: citizenshipValues(),
      citizenship_other: values.citizenship_other || null,
      israeli_id_number: values.israeli_id_number || null,
      israeli_passport_number: values.israeli_passport_number || null,
      us_passport_number: values.us_passport_number || null,
      us_social_security_number: values.us_social_security_number || null,
      french_passport_number: values.french_passport_number || null,
      other_passport_number: values.other_passport_number || null,
      visa: visaValue(),
      visa_other: values.arrival_visa === "אחר" ? values.arrival_visa_other || null : null,
      needs_student_visa: values.student_visa_needed === "כן",
      visa_passport_choice: values.visa_passport_choice || null,
      visa_passport_number: selectedVisaPassportNumber() || null,
      prior_f1_visa_during_group: priorF1DisplayValue() || null,
      prior_f1_visa_valid: priorF1ValidDisplayValue() || null,
      prior_f1_visa_expiration: values.prior_f1_visa_expiration || null,
      student_visa_rules_accepted: studentVisaRulesAccepted(),
      student_visa_signature_signed_at: values.student_visa_signature ? new Date().toISOString() : null,
      student_about: values.student_about || null,
      father_name: values.father_name,
      father_phone: values.father_phone,
      father_email: values.father_email || null,
      mother_name: values.mother_name,
      mother_phone: values.mother_phone,
      mother_email: values.mother_email || null,
      parents_live_together: parentsLiveTogetherValue(),
      parents_street: values.parents_street || null,
      parents_city: values.parents_city || null,
      parents_state: values.parents_state || null,
      parents_zip: values.parents_zip || null,
      father_address_not_relevant: Boolean(values.father_address_not_relevant),
      father_street: values.father_address_not_relevant ? null : values.father_street || null,
      father_city: values.father_address_not_relevant ? null : values.father_city || null,
      father_state: values.father_address_not_relevant ? null : values.father_state || null,
      father_zip: values.father_address_not_relevant ? null : values.father_zip || null,
      mother_address_not_relevant: Boolean(values.mother_address_not_relevant),
      mother_street: values.mother_address_not_relevant ? null : values.mother_street || null,
      mother_city: values.mother_address_not_relevant ? null : values.mother_city || null,
      mother_state: values.mother_address_not_relevant ? null : values.mother_state || null,
      mother_zip: values.mother_address_not_relevant ? null : values.mother_zip || null,
      parent_response_email: responseEmail,
      registration_payment_status: values.registration_payment_status || null,
      registration_payment_session_id: values.registration_payment_session_id || null,
      registration_payment_amount_usd: values.registration_payment_amount_usd || 10,
      registration_payment_paid_at: values.registration_payment_paid_at || null,
      registration_payment_existing_birth_date: values.registration_payment_existing_birth_date || null,
      registration_payment_existing_last_name_en: values.registration_payment_existing_last_name_en || null,
      discount_request_type: values.discount_request_type || null,
      deposit_terms_accepted: Boolean(values.deposit_terms_accepted),
      dormitory_rules_accepted: Boolean(values.dormitory_rules_accepted),
      dormitory_commitment_presence: Boolean(values.dormitory_commitment_presence),
      dormitory_commitment_staff: Boolean(values.dormitory_commitment_staff),
      dormitory_commitment_cleanliness: Boolean(values.dormitory_commitment_cleanliness),
      dormitory_commitment_restrictions: Boolean(values.dormitory_commitment_restrictions),
      dormitory_commitment_discipline: Boolean(values.dormitory_commitment_discipline),
      dormitory_rules_signature_signed_at: values.dormitory_rules_signature ? new Date().toISOString() : null,
      emergency_name: values.emergency_name,
      emergency_phone: values.emergency_phone,
      emergency_relation: values.emergency_relation,
      special_diet: healthAnswer("special_diet"),
      eating_disorder: healthAnswer("eating_disorder"),
      psychological_treatment: healthAnswer("psychological_treatment"),
      emotional_condition: healthAnswer("emotional_condition"),
      allergies: healthAnswer("allergies"),
      asthma: healthAnswer("asthma"),
      eczema_hives: healthAnswer("eczema_hives"),
      tuberculosis: healthAnswer("tuberculosis"),
      epilepsy: healthAnswer("epilepsy"),
      diabetes: healthAnswer("diabetes"),
      digestive_condition: healthAnswer("digestive_condition"),
      significant_other_condition: healthAnswer("significant_other_condition"),
      weight: values.weight || null,
      height: values.height || null,
      medications_last_three_years: healthAnswer("medications_last_three_years"),
      last_tetanus_date: values.last_tetanus_date || null,
      eye_findings: healthAnswer("eye_findings"),
      ear_findings: healthAnswer("ear_findings"),
      nose_findings: healthAnswer("nose_findings"),
      mouth_throat_findings: healthAnswer("mouth_throat_findings"),
      skin_findings: healthAnswer("skin_findings"),
      heart_findings: healthAnswer("heart_findings"),
      lung_findings: healthAnswer("lung_findings"),
      nervous_system_findings: healthAnswer("nervous_system_findings"),
      orthopedic_findings: healthAnswer("orthopedic_findings"),
      speech_findings: healthAnswer("speech_findings"),
      hospitalization_surgery: healthAnswer("hospitalization_surgery"),
      physical_limitation: healthAnswer("physical_limitation"),
      regular_medication: healthAnswer("regular_medication"),
      medication_allergy: healthAnswer("medication_allergy"),
      additional_health_info: values.additional_health_info || null,
      health_information_confirmed: Boolean(values.health_information_confirmed),
      health_signature_signed_at: values.health_signature ? new Date().toISOString() : null,
      has_health_note: hasAnyHealthNote(),
      health_note: healthSummary(),
      arrival_ticket_status: values.arrival_ticket_status || null,
      arrival_date: values.arrival_ticket_status === "יש לי כרטיס" ? values.arrival_date : null,
      study_duration: studyDurationValue(),
      study_start_date: billingPlan.startDate,
      study_end_date: billingPlan.endDate,
      tuition_billing_months: billingNumberValue(billingPlan.months),
      tuition_deposit_charge_factor: billingNumberValue(billingPlan.preFirstRegularChargeFactor),
      tuition_first_charge_date: billingPlan.firstChargeDate,
      tuition_last_charge_date: billingPlan.lastChargeDate,
      tuition_last_charge_factor: billingNumberValue(billingPlan.lastChargeFactor),
      has_ticket: values.arrival_ticket_status === "יש לי כרטיס",
      media_permission: mediaPermissionValue(),
      media_permission_text: values.media_permission || null,
      media_signature_signed_at: values.media_signature ? new Date().toISOString() : null,
      _form_started_at: formStartedAt,
      _contact_company: spamTrapInput?.value || "",
      submitted_at: new Date().toISOString()
    };
  }

  async function uploadAllFiles(registrationId) {
    const entries = Object.entries(state.files).filter(([, file]) => hasFileValue(file));
    for (const [fieldId, fileValue] of entries) {
      for (const file of fileList(fileValue)) {
        const storagePath = `${registrationId}/${fieldId}-${Date.now()}-${safeFileName(file.name)}`;
        await supabaseFetch(`/storage/v1/object/${config.STORAGE_BUCKET}/${storagePath}`, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "true" },
          body: file
        });
        await supabaseFetch("/rest/v1/registration_documents", {
          method: "POST",
          body: JSON.stringify({
            registration_id: registrationId,
            document_type: fieldId,
            storage_bucket: config.STORAGE_BUCKET,
            storage_path: storagePath,
            original_filename: file.name,
            mime_type: file.type,
            file_size_bytes: file.size,
            required: fieldId === "student_photo"
          })
        });
      }
    }
  }

  async function supabaseFetch(path, options) {
    const response = await fetch(`${config.SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Supabase error ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return response.json();
  }

  function showSuccess() {
    const tpl = document.getElementById("successTemplate");
    document.querySelector(".form-panel").innerHTML = tpl.innerHTML;
    document.getElementById("newFormBtn").addEventListener("click", () => location.reload());
  }

  function reviewCards() {
    const missingFilesPanel = missingRequiredFilesReviewHtml();
    const cards = [
      reviewCard("פרטי תלמיד", "student", studentReviewRows()),
      reviewCard("אשרת שהייה", "visa", visaReviewRows()),
      reviewCard("פרטי ההורים", "parents", parentsReviewRows()),
      reviewCard("שכר לימוד", "tuition", tuitionReviewRows()),
      reviewCard("בריאות", "emergency_health", healthReviewRows()),
      reviewCard("שליחת תשובת הרישום", "next_steps", responseReviewRows())
    ].join("");
    return `
      <div class="review-toolbar">
        <button type="button" class="secondary review-print" data-print-review>הדפס / שמור PDF</button>
      </div>
      ${missingFilesPanel}
      ${cards}
    `;
  }

  function missingRequiredFilesReviewHtml() {
    const missingFiles = missingRequiredFiles();
    if (!missingFiles.length) return "";

    return `
      <section class="review-missing-files">
        <h3>קבצים שצריך לצרף מחדש</h3>
        <p>הקבצים אינם נשמרים לאחר רענון הדף. יש לצרף אותם מחדש לפני השליחה.</p>
        <div class="missing-file-list">
          ${missingFiles.map(({ field, step }) => `
            <div class="missing-file-item">
              <span>${escapeHtml(fieldLabel(field))}</span>
              <button type="button" class="secondary missing-file-action" data-missing-file-step="${escapeHtml(step.id)}" data-missing-file-field="${escapeHtml(field.id)}">צרף מחדש</button>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function reviewCard(title, stepId, rows) {
    return `
      <section class="review-card">
        <div class="review-card-header">
          <h3>${escapeHtml(title)}</h3>
          <button type="button" class="review-edit" data-edit-step="${escapeHtml(stepId)}">✏ ערוך</button>
        </div>
        <div class="review-card-body">
          ${reviewRowsHtml(rows)}
        </div>
      </section>
    `;
  }

  function reviewRowsHtml(rows) {
    const visibleRows = rows.filter(([, value]) => !isEmptyReviewValue(value));
    if (!visibleRows.length) return `<div class="review-empty">לא נמסר מידע לבדיקה.</div>`;
    return visibleRows
      .map(([label, value]) => `<div class="review-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(formatReviewValue(value))}</span></div>`)
      .join("");
  }

  function studentReviewRows() {
    return [
      ["שם מלא בעברית", `${state.values.student_first_name_he || ""} ${state.values.student_last_name_he || ""}`.trim()],
      ["שם מלא באנגלית", `${state.values.student_first_name_en || ""} ${state.values.student_last_name_en || ""}`.trim()],
      ["תאריך לידה עברי", state.values.birth_date_he],
      ["תאריך לידה לועזי", formatDateDdMmYyyy(state.values.birth_date)],
      ["מקום לידה", compactJoin([state.values.birth_city, state.values.birth_country, state.values.birth_zip])],
      ["שנת קבוצה", state.values.student_group_year || defaultGroupYear],
      ...yeshivaReviewRows(),
      ["כתובת אימייל של התלמיד", state.values.student_email],
      ["אזרחויות", citizenshipValues().join(", ")],
      ["מספר תעודת זהות ישראלית", state.values.israeli_id_number],
      ["מספר דרכון ישראלי", state.values.israeli_passport_number],
      ["מספר דרכון אמריקאי", state.values.us_passport_number],
      ["מספר Social Security אמריקאי", state.values.us_social_security_number],
      ["מספר דרכון צרפתי", state.values.french_passport_number],
      ["מספר דרכון אחר", state.values.other_passport_number],
      ["משך הלימודים", studyDurationValue()],
      ["תאריך הגעה", arrivalDateDisplayValue()],
      ["מידע אישי נוסף", state.values.student_about]
    ];
  }

  function visaReviewRows() {
    return [
      ["סוג האשרה", visaDisplayValue()],
      ["דרכון לויזה", selectedVisaPassportNumber()],
      ["ויזת F-1 במהלך הקבוצה", priorF1DisplayValue()],
      ["תוקף ויזת F-1", priorF1ValidDisplayValue()]
    ];
  }

  function parentsReviewRows() {
    return [
      ["שם האב", state.values.father_name],
      ["טלפון האב", state.values.father_phone],
      ["אימייל האב", state.values.father_email],
      ["שם האם", state.values.mother_name],
      ["טלפון האם", state.values.mother_phone],
      ["אימייל האם", state.values.mother_email],
      ["האם ההורים גרים יחד", parentsLiveTogetherValue()],
      ["כתובת משותפת", compactJoin([state.values.parents_street, state.values.parents_city, state.values.parents_state, state.values.parents_zip])],
      ["כתובת האב", state.values.father_address_not_relevant ? "לא רלוונטי" : compactJoin([state.values.father_street, state.values.father_city, state.values.father_state, state.values.father_zip])],
      ["כתובת האם", state.values.mother_address_not_relevant ? "לא רלוונטי" : compactJoin([state.values.mother_street, state.values.mother_city, state.values.mother_state, state.values.mother_zip])]
    ];
  }

  function responseReviewRows() {
    return [
      ["כתובת לשליחת תשובת הרישום", responseEmailValue()]
    ];
  }

  function paymentReviewRows() {
    return [
      ["סטטוס תשלום", paymentStatusReviewValue()],
      ["סכום", `${state.values.registration_payment_amount_usd || 10} דולר`],
      ["מספר אישור תשלום", state.values.registration_payment_session_id],
      ["זיהוי תשלום קודם", alreadyPaidReviewValue()],
      ["זמן תשלום", state.values.registration_payment_paid_at]
    ];
  }

  function paymentStatusReviewValue() {
    if (state.values.registration_payment_status === "dev_skipped") return "דולג לצורך בדיקה";
    if (state.values.registration_payment_status === "already_paid") return "שולם בעבר - אומת במערכת";
    return isRegistrationPaymentPaid() ? "שולם" : "לא שולם";
  }

  function alreadyPaidReviewValue() {
    if (state.values.registration_payment_status !== "already_paid") return "";
    return compactJoin([
      state.values.registration_payment_existing_birth_date,
      state.values.registration_payment_existing_last_name_en
    ]);
  }

  function tuitionReviewRows() {
    const plan = tuitionBillingPlan();
    const rows = [
      ["תקופת לימודים לחיוב", `${formatDateForDisplay(plan.startDate)} - ${formatDateForDisplay(plan.endDate)}`],
      ["מספר חודשי חיוב", formatBillingMonths(plan.months)],
      ["תאריך גבייה ראשון", formatDateForDisplay(plan.firstChargeDate)],
      ["מסלול התשלום שנבחר", tuitionPlanReviewValue()]
    ];
    if (state.values.discount_request_type === additionalDiscountOption) {
      rows.push(["בקשת הנחה", "יש לשלוח את קובץ בקשת ההנחה לכתובת cherut@kvutze.org"]);
    }
    return rows;
  }

  function tuitionPlanReviewValue() {
    const selected = state.values.discount_request_type || "";
    if (!selected) return "";
    if (selected === additionalDiscountOption) return "אני מבקש הנחה נוספת ואשלח טופס באימייל.";
    const amountMatch = selected.match(/(\d+\s+דולר לחודש(?:\s+\(כפול\s+[^)]+\))?)/);
    if (amountMatch) return amountMatch[1].replace(/\.$/, "");
    return selected;
  }

  function healthReviewRows() {
    const summary = healthSummaryParts();
    return summary.length ? summary.map((line) => ["מידע רפואי שדווח", line]) : [["מידע רפואי", "לא דווח על מידע רפואי מיוחד."]];
  }

  function discountRequestSummary() {
    if (!state.values.discount_request_type) return "";
    if (state.values.discount_request_type.startsWith("עלות בחור מליאה")) return "לא הוגשה בקשת הנחה";
    if (state.values.discount_request_type.startsWith("אני מבקש את ההנחה הבסיסית")) return "הוגשה בקשת הנחה בסיסית";
    return "הוגשה בקשת הנחה נוספת";
  }

  function compactJoin(parts) {
    return parts.filter((part) => !isEmptyReviewValue(part)).join(", ");
  }

  function formatDateDdMmYyyy(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return value || "";
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  function formatCurrencyAmount(value, currency) {
    if (isEmptyReviewValue(value)) return "";
    return `${value} ${currency}`;
  }

  function formatReviewValue(value) {
    if (Array.isArray(value)) return value.filter((item) => !isEmptyReviewValue(item)).join(", ");
    return String(value || "");
  }

  function isEmptyReviewValue(value) {
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
  }

  function isVisible(field) {
    if (field.visibleWhen && !field.visibleWhen()) return false;

    if (field.hideWhen) {
      const hiddenValue = state.values[field.hideWhen.field];
      if (field.hideWhen.equals !== undefined && hiddenValue === field.hideWhen.equals) return false;
    }

    if (field.hideWhenContains) {
      const hiddenValue = state.values[field.hideWhenContains.field];
      if (Array.isArray(hiddenValue) && hiddenValue.includes(field.hideWhenContains.value)) return false;
    }

    if (field.showWhenAnyExcept) {
      const actual = state.values[field.showWhenAnyExcept.field];
      return Array.isArray(actual) && actual.some((value) => value !== field.showWhenAnyExcept.except);
    }

    if (field.showWhenIn) {
      const actual = state.values[field.showWhenIn.field] || (field.showWhenIn.field === "student_group_year" ? defaultGroupYear : "");
      if (!field.showWhenIn.values.includes(actual)) return false;
    }

    if (field.showWhenNotContains) {
      const actual = state.values[field.showWhenNotContains.field];
      return !Array.isArray(actual) || !actual.includes(field.showWhenNotContains.value);
    }

    if (!field.showWhen) return true;
    const actual = state.values[field.showWhen.field];
    if (field.showWhen.equals !== undefined) return actual === field.showWhen.equals;
    if (field.showWhen.contains !== undefined) return Array.isArray(actual) && actual.includes(field.showWhen.contains);
    return true;
  }

  function isDisabled(field) {
    if (!field.disabledWhen) return false;
    const actual = state.values[field.disabledWhen.field];
    if (field.disabledWhen.equals !== undefined) return actual === field.disabledWhen.equals;
    return false;
  }

  function applyLinkedFieldRules(changedField) {
    if (["student_email", "father_email", "mother_email"].includes(changedField)) {
      const options = responseRecipientOptions();
      if (state.values.response_recipient && !options.includes(state.values.response_recipient)) {
        state.values.response_recipient = "";
      }
    }

    if (["citizenships", "citizenship_other", "israeli_passport_number", "french_passport_number", "other_passport_number", "student_visa_needed"].includes(changedField)) {
      const options = visaPassportOptions();
      if (state.values.visa_passport_choice && !options.includes(state.values.visa_passport_choice)) {
        state.values.visa_passport_choice = "";
      }
      if (state.values.student_visa_needed !== "כן") state.values.visa_passport_choice = "";
    }

    if (changedField === "student_group_year" && state.values.student_group_year !== defaultGroupYear) {
      state.values.same_yeshiva_3_years = false;
      state.values.yeshiva_5785 = "";
      state.values.yeshiva_5785_other = "";
      state.values.yeshiva_5784 = "";
      state.values.yeshiva_5784_other = "";
      if (state.values.student_group_year === "קבוצה תשפ\"ו") state.values.yeshiva_after_group_text = "";
    }

    if (changedField === "student_group_year" && state.values.student_group_year === defaultGroupYear) {
      clearPriorF1Fields();
    }

    if (["student_group_year", "study_duration"].includes(changedField)) {
      state.values.study_duration_other = "";
      if (!shouldAskStudyStartDate()) state.values.study_start_date = "";
      if (!shouldAskStudyEndDate()) state.values.study_end_date = "";
    }

    if (changedField === "student_visa_needed" && state.values.student_visa_needed !== "כן") {
      clearPriorF1Fields();
    }

    if (changedField === "prior_f1_visa_during_group" && state.values.prior_f1_visa_during_group !== "כן") {
      state.values.prior_f1_visa_valid = "";
      state.values.prior_f1_visa_expiration = "";
    }

    if (changedField === "prior_f1_visa_valid" && state.values.prior_f1_visa_valid !== "כן") {
      state.values.prior_f1_visa_expiration = "";
    }

    if (changedField === "same_yeshiva_3_years" && !state.values.same_yeshiva_3_years) {
      clearSyncedYeshivaYears();
      return;
    }

    if (
      changedField === "same_yeshiva_3_years" ||
      ((changedField === "yeshiva_5786" || changedField === "yeshiva_5786_other") && state.values.same_yeshiva_3_years)
    ) {
      syncYeshivaYears();
    }

    if (changedField === "parents_live_together") {
      clearParentAddressFields();
    }

    if (changedField === "father_address_not_relevant" && state.values.father_address_not_relevant) {
      clearFatherAddressFields();
    }

    if (changedField === "mother_address_not_relevant" && state.values.mother_address_not_relevant) {
      clearMotherAddressFields();
    }
  }

  function clearParentAddressFields() {
    [
      "parents_street",
      "parents_city",
      "parents_state",
      "parents_zip",
      "father_address_not_relevant",
      "father_street",
      "father_city",
      "father_state",
      "father_zip",
      "mother_address_not_relevant",
      "mother_street",
      "mother_city",
      "mother_state",
      "mother_zip"
    ].forEach((fieldId) => {
      state.values[fieldId] = fieldId.endsWith("_not_relevant") ? false : "";
    });
  }

  function clearFatherAddressFields() {
    ["father_street", "father_city", "father_state", "father_zip"].forEach((fieldId) => {
      state.values[fieldId] = "";
    });
  }

  function clearMotherAddressFields() {
    ["mother_street", "mother_city", "mother_state", "mother_zip"].forEach((fieldId) => {
      state.values[fieldId] = "";
    });
  }

  function syncYeshivaYears() {
    if (!state.values.same_yeshiva_3_years) return;
    state.values.yeshiva_5785 = state.values.yeshiva_5786 || "";
    state.values.yeshiva_5784 = state.values.yeshiva_5786 || "";
    state.values.yeshiva_5785_other = state.values.yeshiva_5786_other || "";
    state.values.yeshiva_5784_other = state.values.yeshiva_5786_other || "";
  }

  function clearSyncedYeshivaYears() {
    state.values.yeshiva_5785 = "";
    state.values.yeshiva_5784 = "";
    state.values.yeshiva_5785_other = "";
    state.values.yeshiva_5784_other = "";
  }

  function clearPriorF1Fields() {
    state.values.prior_f1_visa_during_group = "";
    state.values.prior_f1_visa_valid = "";
    state.values.prior_f1_visa_expiration = "";
  }

  function yeshivaValue(year) {
    const selected = state.values[`yeshiva_${year}`] || "";
    if (selected === "אחר") return state.values[`yeshiva_${year}_other`] || "";
    return selected;
  }

  function yeshivaBeforeGroupValue() {
    return yeshivaValue("5786");
  }

  function yeshivaAfterGroupValue() {
    const selectedGroup = state.values.student_group_year || defaultGroupYear;
    if (selectedGroup === defaultGroupYear || selectedGroup === "קבוצה תשפ\"ו") return "";
    return state.values.yeshiva_after_group_text || "";
  }

  function yeshivaReviewRows() {
    const selectedGroup = state.values.student_group_year || defaultGroupYear;
    if (selectedGroup === defaultGroupYear) {
      return [
        ["ישיבה תשפ״ו", yeshivaValue("5786")]
      ];
    }
    const groupData = groupYearMap[selectedGroup] || groupYearMap[defaultGroupYear];
    const rows = [[`מקום לימודים בשנה שלפני הקבוצה (${groupData.before})`, yeshivaBeforeGroupValue()]];
    if (groupData.after) rows.push([`איפה היה בשנה שאחרי הקבוצה (${groupData.after})`, yeshivaAfterGroupValue()]);
    return rows;
  }

  function ensureDefaultValues() {
    if (!state.values.student_group_year) state.values.student_group_year = defaultGroupYear;
  }

  function isEmailOrNone(value) {
    const normalized = String(value || "").trim();
    if (normalized === "אין לי") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  }

  function stripeCustomerEmail() {
    const normalized = String(state.values.student_email || "").trim();
    return isStrictEmail(normalized) ? normalized : "";
  }

  function isStrictEmail(value) {
    const normalized = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  }

  function isValidIsraeliId(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (!digits || digits.length > 9) return false;
    const id = digits.padStart(9, "0");
    let sum = 0;

    for (let index = 0; index < id.length; index += 1) {
      let digit = Number(id[index]) * ((index % 2) + 1);
      if (digit > 9) digit -= 9;
      sum += digit;
    }

    return sum % 10 === 0;
  }

  function maxBirthDateForAge(age) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - age);
    return formatDateInputValue(date);
  }

  function isAtLeastAge(value, age) {
    const birthDate = parseDateInputValue(value);
    if (!birthDate) return false;
    return birthDate <= parseDateInputValue(maxBirthDateForAge(age));
  }

  function parseDateInputValue(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (
      date.getFullYear() !== Number(match[1]) ||
      date.getMonth() !== Number(match[2]) - 1 ||
      date.getDate() !== Number(match[3])
    ) {
      return null;
    }
    return date;
  }

  function formatDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isEmpty(value) {
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
  }

  function hasFileValue(fileValue) {
    return Array.isArray(fileValue) ? fileValue.length > 0 : Boolean(fileValue);
  }

  function fileList(fileValue) {
    if (!fileValue) return [];
    return Array.isArray(fileValue) ? fileValue : [fileValue];
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function clearErrors() {
    formError.textContent = "";
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  }

  function setError(id, message) {
    const el = document.getElementById(`${id}_error`);
    if (el) el.textContent = message;
  }

  function saveDraft(showMessage = true) {
    setDraftStorage(JSON.stringify({
      values: state.values,
      stepIndex: state.stepIndex
    }));
    if (showMessage) {
      formError.textContent = "הטיוטה נשמרה במכשיר הזה.";
      setTimeout(() => {
        if (formError.textContent === "הטיוטה נשמרה במכשיר הזה.") formError.textContent = "";
      }, 2000);
    }
  }

  function loadDraft() {
    try {
      const draft = JSON.parse(getDraftStorage() || "{}");
      return draft && typeof draft === "object" && "values" in draft ? draft.values || {} : draft;
    } catch {
      return {};
    }
  }

  function loadDraftStep() {
    try {
      const draft = JSON.parse(getDraftStorage() || "{}");
      const stepIndex = Number(draft?.stepIndex);
      return Number.isInteger(stepIndex) && stepIndex >= 0 && stepIndex < steps.length ? stepIndex : 0;
    } catch {
      return 0;
    }
  }

  function getDraftStorage() {
    try {
      const persistentDraft = localStorage.getItem(STORAGE_KEY);
      if (persistentDraft) return persistentDraft;
    } catch {
      // Ignore storage access errors in private browsing modes.
    }

    try {
      const tabDraft = sessionStorage.getItem(STORAGE_KEY);
      if (tabDraft) {
        setDraftStorage(tabDraft);
        return tabDraft;
      }
    } catch {
      // Ignore storage access errors in private browsing modes.
    }

    return null;
  }

  function setDraftStorage(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      return;
    } catch {
      // Fall back to tab-only storage if persistent storage is unavailable.
    }

    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage access errors in private browsing modes.
    }
  }

  function clearDraftStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors in private browsing modes.
    }

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors in private browsing modes.
    }
  }

  function responseRecipient(value) {
    if (value === "אימייל התלמיד" || value === "כתובת הדוא\"ל של התלמיד") return "student";
    if (value === "אימייל האם" || value === "כתובת הדוא\"ל של האם") return "mother";
    return "father";
  }

  function responseRecipientOptions() {
    const options = [];
    if (isStrictEmail(state.values.father_email)) options.push("כתובת הדוא\"ל של האב");
    if (isStrictEmail(state.values.mother_email)) options.push("כתובת הדוא\"ל של האם");
    if (isStrictEmail(state.values.student_email)) options.push("כתובת הדוא\"ל של התלמיד");
    return options;
  }

  function responseEmailValue() {
    if (state.values.response_recipient === "אימייל התלמיד" || state.values.response_recipient === "כתובת הדוא\"ל של התלמיד") return state.values.student_email || "";
    if (state.values.response_recipient === "אימייל האם" || state.values.response_recipient === "כתובת הדוא\"ל של האם") return state.values.mother_email || "";
    return state.values.father_email || "";
  }

  function visaPassportOptions() {
    return visaPassportEntries().map((entry) => entry.label);
  }

  function visaPassportEntries() {
    const entries = [];
    const citizenships = state.values.citizenships || [];
    if (citizenships.includes("ישראל") && state.values.israeli_passport_number) {
      entries.push({ label: "דרכון ישראלי", number: state.values.israeli_passport_number });
    }
    if (citizenships.includes("צרפת") && state.values.french_passport_number) {
      entries.push({ label: "דרכון צרפתי", number: state.values.french_passport_number });
    }
    if (citizenships.includes("אחר") && state.values.other_passport_number) {
      const citizenship = state.values.citizenship_other ? ` ${state.values.citizenship_other}` : " אחר";
      entries.push({ label: `דרכון${citizenship}`, number: state.values.other_passport_number });
    }
    return entries;
  }

  function selectedVisaPassportNumber() {
    if (state.values.student_visa_needed !== "כן") return "";
    const entries = visaPassportEntries();
    if (!entries.length) return "";
    if (entries.length === 1) return entries[0].number;
    const selected = entries.find((entry) => entry.label === state.values.visa_passport_choice);
    return selected ? selected.number : "";
  }

  function citizenshipValues() {
    return (state.values.citizenships || []).map((citizenship) => {
      if (citizenship === "אחר") return state.values.citizenship_other || "אחר";
      return citizenship;
    });
  }

  function fieldLabel(field) {
    if (!field.dynamicLabel) return field.label;
    if (field.dynamicLabel.resolver) return dynamicFieldLabel(field.dynamicLabel.resolver, field);
    const dynamicValue = state.values[field.dynamicLabel.field] || "";
    if (!dynamicValue) return field.dynamicLabel.fallback || field.dynamicLabel.prefix;
    return `${field.dynamicLabel.prefix}${field.dynamicLabel.separator || ""}${dynamicValue}`.trim();
  }

  function dynamicFieldLabel(resolver, field) {
    const selectedGroup = state.values.student_group_year || defaultGroupYear;
    const groupData = groupYearMap[selectedGroup] || groupYearMap[defaultGroupYear];
    if (resolver === "yeshivaBeforeGroupLabel") {
      if (selectedGroup === defaultGroupYear) return field.label;
      return `מקום הלימודים בשנה שלפני הקבוצה שלך (שנת ${groupData.before})`;
    }
    if (resolver === "yeshivaBeforeGroupOtherLabel") {
      if (selectedGroup === defaultGroupYear) return field.label;
      return `שם הישיבה בשנה שלפני הקבוצה שלך (שנת ${groupData.before})`;
    }
    if (resolver === "yeshivaMiddleGroupLabel") {
      if (selectedGroup === defaultGroupYear) return field.label;
      return `איפה היית בשנה שאחרי הקבוצה שלך (שנת ${groupData.after})`;
    }
    if (resolver === "yeshivaMiddleGroupOtherLabel") {
      if (selectedGroup === defaultGroupYear) return field.label;
      return `פירוט המקום בשנה שאחרי הקבוצה שלך (שנת ${groupData.after})`;
    }
    if (resolver === "yeshivaAfterGroupTextLabel") {
      return `איפה היית בשנה שאחרי הקבוצה שלך (שנת ${groupData.after})`;
    }
    return field.label;
  }

  function updateDynamicLabels() {
    steps[state.stepIndex].fields.forEach((field) => {
      if (!field.dynamicLabel) return;
      const wrapper = document.querySelector(`[data-field="${field.id}"]`);
      const label = wrapper?.querySelector("label");
      if (label) label.textContent = `${fieldLabel(field)}${field.required ? " *" : ""}`;
    });
  }

  function resolvedFieldValue(fieldId) {
    const field = steps.flatMap((step) => step.fields).find((item) => item.id === fieldId);
    const value = state.values[fieldId];
    const inline = field?.inlineOtherField;
    if (!inline) return value;
    if (Array.isArray(value)) {
      return value.map((item) => (item === inline.option ? state.values[inline.fieldId] || inline.option : item));
    }
    if (value === inline.option) return state.values[inline.fieldId] || inline.option;
    return value;
  }

  function healthAnswer(fieldId) {
    const field = steps.flatMap((step) => step.fields).find((item) => item.id === fieldId);
    if (state.values[fieldId] === "כן") return field?.detailsField ? state.values[field.detailsField] || "" : "כן";
    if (state.values[fieldId] === "לא") return "לא";
    return "";
  }

  function parentsLiveTogetherValue() {
    if (state.values.parents_live_together === "לא") return state.values.parents_live_together_details || "";
    return state.values.parents_live_together || "";
  }

  function hasAnyHealthNote() {
    return healthSummaryParts().length > 0;
  }

  function healthSummary() {
    return healthSummaryParts().join("\n");
  }

  function healthSummaryParts() {
    const parts = [];
    steps
      .find((step) => step.id === "emergency_health")
      .fields
      .forEach((field) => {
        if (!field.detailsField) return;
        if (field.detailsWhenAnyExcept) {
          const selected = state.values[field.id] || [];
          if (selected.some((value) => value !== field.detailsWhenAnyExcept)) {
            parts.push(`${field.label}: ${(selected || []).join(", ")}. פירוט: ${state.values[field.detailsField] || ""}`);
          }
          return;
        }
        if (state.values[field.id] === "כן") {
          parts.push(`${field.label}: ${state.values[field.detailsField] || ""}`);
        }
      });

    if (state.values.additional_health_info) {
      parts.push(`מידע נוסף: ${state.values.additional_health_info}`);
    }

    return parts;
  }

  function visaValue() {
    const values = state.values;
    if (Array.isArray(values.citizenships) && values.citizenships.includes("ארה״ב")) return "us_passport";
    if (values.student_visa_needed === "כן") return "f1_student_requested";

    const map = {
      "גרין כארד": "green_card",
      "ויזת תייר": "tourist_visa",
      איסטא: "esta",
      אחר: "other"
    };
    return map[values.arrival_visa] || "other";
  }

  function visaDisplayValue() {
    const values = state.values;
    if (Array.isArray(values.citizenships) && values.citizenships.includes("ארה״ב")) return "דרכון אמריקאי";
    if (values.student_visa_needed === "כן") return "זקוק לויזת סטודנט";
    if (values.arrival_visa === "אחר") return values.arrival_visa_other || "אחר";
    return values.arrival_visa || "";
  }

  function priorF1DisplayValue() {
    const values = state.values;
    if (!values.prior_f1_visa_during_group) return "";
    if (values.prior_f1_visa_during_group === "לא") return "לא הייתה ויזת F-1 במהלך הקבוצה";
    return priorF1ValidDisplayValue() || "הייתה ויזת F-1 במהלך הקבוצה";
  }

  function priorF1ValidDisplayValue() {
    const values = state.values;
    if (values.prior_f1_visa_during_group !== "כן") return "";
    if (values.prior_f1_visa_valid === "כן") return `בתוקף עד ${values.prior_f1_visa_expiration || ""}`.trim();
    if (values.prior_f1_visa_valid === "לא") return "אינה בתוקף";
    return "";
  }

  function arrivalDateDisplayValue() {
    if (state.values.arrival_ticket_status === "אין לי עדיין כרטיס - אעדכן בהמשך") return state.values.arrival_ticket_status;
    return state.values.arrival_date || "";
  }

  function studyDurationValue() {
    const plan = tuitionBillingPlan();
    const duration = state.values.study_duration || "";
    if (duration === "לא שנה תמימה") {
      return `לא שנה תמימה - ${formatDateForDisplay(plan.startDate)} עד ${formatDateForDisplay(plan.endDate)}`;
    }
    return duration || "שנה תמימה";
  }

  function discountCircumstancesValues() {
    return (state.values.discount_circumstances || []).map((item) => {
      if (item === "אחר") return state.values.discount_circumstances_other || "אחר";
      return item;
    });
  }

  function mediaPermissionValue() {
    if (!state.values.media_permission) return null;
    return state.values.media_permission.startsWith("אני מאשר");
  }

  function studentVisaRulesAccepted() {
    return [
      "student_visa_rule_i20",
      "student_visa_rule_attendance",
      "student_visa_rule_travel",
      "student_visa_rule_work",
      "student_visa_rule_dormitory",
      "student_visa_rule_confirmation"
    ].every((fieldId) => Boolean(state.values[fieldId]));
  }

  function slug(value) {
    return String(value).replace(/\W+/g, "_");
  }

  function safeFileName(value) {
    return String(value).replace(/[^\w.\-א-ת]/g, "_");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
