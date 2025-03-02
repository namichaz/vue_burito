import ELanguageType from "@/domain/model/lang/ELanguageType";
import messageJajp from "@/presentation/lang/message_jajp.json";
import messageEnus from "@/presentation/lang/message_enus.json";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  legacy: false,
  warnHtmlInMessage: false,
  locale: ELanguageType.JAJP,
  messages: {
    jajp: messageJajp,
    enus: messageEnus,
  },
});

export default i18n;
