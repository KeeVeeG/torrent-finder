import ru from '@/locales/ru.json'

const locales = {
  'ru': ru
}
export default function localize(word){
  const locale = navigator.languages[0].split("-")[0]
  return locales[locale]?.[word] || word
}