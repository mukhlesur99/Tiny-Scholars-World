/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from './types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  playNow: string;
  continueGame: string;
  selectModule: string;
  selectLevel: string;
  level: string;
  stars: string;
  totalStars: string;
  stickers: string;
  parentZone: string;
  parentSettings: string;
  parentGateTitle: string;
  parentGateHint: string;
  parentGateFailed: string;
  sound: string;
  voice: string;
  volume: string;
  highContrast: string;
  reducedMotion: string;
  speechRate: string;
  resetProgress: string;
  resetConfirm: string;
  resetSuccess: string;
  exportData: string;
  importData: string;
  importSuccess: string;
  importError: string;
  privacyPolicy: string;
  safetyCompliance: string;
  back: string;
  home: string;
  nextLevel: string;
  playAgain: string;
  greatJob: string;
  wellDone: string;
  tryAgain: string;
  touchToCount: string;
  matchTheShape: string;
  findTheColor: string;
  findTheAnimal: string;
  completeThePattern: string;
  findMatchingPairs: string;
  allLevelsCompleted: string;
  // Modules
  mod_number_adventure: string;
  mod_number_desc: string;
  mod_shape_explorer: string;
  mod_shape_desc: string;
  mod_color_quest: string;
  mod_color_desc: string;
  mod_animal_world: string;
  mod_animal_desc: string;
  mod_logic_puzzle: string;
  mod_logic_desc: string;
  mod_memory_challenge: string;
  mod_memory_desc: string;
  // Feedback
  awesome: string;
  superStar: string;
  correct: string;
  keepGoing: string;
  youGotIt: string;
  // Settings detail
  offlineModeNotice: string;
  dataSafetyBadge: string;
}

export const LOCALES: Record<LanguageCode, { label: string; nativeName: string; dir: 'ltr' | 'rtl'; strings: TranslationStrings }> = {
  en: {
    label: 'English',
    nativeName: 'English',
    dir: 'ltr',
    strings: {
      appName: 'WonderTots Learning Quest',
      tagline: 'Joyful, safe & offline educational adventures for curious minds!',
      playNow: 'Start Playing',
      continueGame: 'Continue',
      selectModule: 'Choose an Adventure',
      selectLevel: 'Select Level',
      level: 'Level',
      stars: 'Stars',
      totalStars: 'Total Stars',
      stickers: 'Sticker Album',
      parentZone: 'Parent Area',
      parentSettings: 'Parent Settings & Privacy',
      parentGateTitle: 'Adult Verification',
      parentGateHint: 'Please solve this simple math question to proceed to settings:',
      parentGateFailed: 'Incorrect answer. Please try again.',
      sound: 'Sound Effects',
      voice: 'Voice Narration',
      volume: 'Volume',
      highContrast: 'High Contrast Mode',
      reducedMotion: 'Reduced Motion',
      speechRate: 'Narration Speed',
      resetProgress: 'Reset Game Progress',
      resetConfirm: 'Are you sure you want to reset all game progress? This cannot be undone.',
      resetSuccess: 'Progress has been reset.',
      exportData: 'Backup Save File (JSON)',
      importData: 'Restore Save File',
      importSuccess: 'Game progress restored successfully!',
      importError: 'Invalid save file format.',
      privacyPolicy: 'Child Privacy Policy (COPPA & GDPR-K)',
      safetyCompliance: 'Google Play Families Compliance',
      back: 'Back',
      home: 'Home',
      nextLevel: 'Next Level',
      playAgain: 'Play Again',
      greatJob: 'Fantastic Job!',
      wellDone: 'Well Done!',
      tryAgain: 'Almost there! Try again.',
      touchToCount: 'Tap each item to count, then choose the number!',
      matchTheShape: 'Find the shape that matches the outline!',
      findTheColor: 'Tap all the items of this color!',
      findTheAnimal: 'Match the animal with its sound or habitat!',
      completeThePattern: 'What comes next in the pattern?',
      findMatchingPairs: 'Flip cards to find identical matching pairs!',
      allLevelsCompleted: 'You mastered this adventure!',
      mod_number_adventure: 'Number Adventure',
      mod_number_desc: 'Counting, number shapes & fun adding',
      mod_shape_explorer: 'Shape Explorer',
      mod_shape_desc: 'Circles, squares, stars & silhouettes',
      mod_color_quest: 'Color Quest',
      mod_color_desc: 'Rainbow colors, matching & sorting',
      mod_animal_world: 'Animal World',
      mod_animal_desc: 'Cute creatures, sounds & habitats',
      mod_logic_puzzle: 'Logic Puzzle',
      mod_logic_desc: 'Visual patterns, sizes & smart sequences',
      mod_memory_challenge: 'Memory Challenge',
      mod_memory_desc: 'Card matching & playful recall memory',
      awesome: 'Awesome!',
      superStar: 'Super Star!',
      correct: 'Correct!',
      keepGoing: 'Keep Going!',
      youGotIt: 'You Did It!',
      offlineModeNotice: '100% Offline: No internet, no accounts, and no data tracking.',
      dataSafetyBadge: 'COPPA & GDPR-K Child Safe Verified',
    },
  },
  es: {
    label: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    strings: {
      appName: 'Aventura WonderTots',
      tagline: '¡Aventuras educativas alegres, seguras y sin conexión para niños curiosos!',
      playNow: 'Empezar a Jugar',
      continueGame: 'Continuar',
      selectModule: 'Elige una Aventura',
      selectLevel: 'Selecciona Nivel',
      level: 'Nivel',
      stars: 'Estrellas',
      totalStars: 'Estrellas Totales',
      stickers: 'Álbum de Pegatinas',
      parentZone: 'Área de Padres',
      parentSettings: 'Ajustes y Privacidad Familiar',
      parentGateTitle: 'Verificación para Adultos',
      parentGateHint: 'Resuelve esta operación matemática para entrar a ajustes:',
      parentGateFailed: 'Respuesta incorrecta. Inténtalo de nuevo.',
      sound: 'Efectos de Sonido',
      voice: 'Narración de Voz',
      volume: 'Volumen',
      highContrast: 'Modo Alto Contraste',
      reducedMotion: 'Movimiento Reducido',
      speechRate: 'Velocidad de Voz',
      resetProgress: 'Reiniciar Progreso',
      resetConfirm: '¿Seguro que deseas reiniciar todo el progreso? No se puede deshacer.',
      resetSuccess: 'El progreso ha sido reiniciado.',
      exportData: 'Copia de Seguridad (JSON)',
      importData: 'Restaurar Progreso',
      importSuccess: '¡Progreso restaurado con éxito!',
      importError: 'Formato de archivo inválido.',
      privacyPolicy: 'Política de Privacidad Infantil',
      safetyCompliance: 'Cumplimiento del Programa Familiar de Google Play',
      back: 'Atrás',
      home: 'Inicio',
      nextLevel: 'Siguiente Nivel',
      playAgain: 'Jugar de Nuevo',
      greatJob: '¡Trabajo Fantástico!',
      wellDone: '¡Muy Bien!',
      tryAgain: '¡Casi! Inténtalo otra vez.',
      touchToCount: '¡Toca cada objeto para contar y luego elige el número!',
      matchTheShape: '¡Encuentra la figura que coincide con la silueta!',
      findTheColor: '¡Toca todos los objetos de este color!',
      findTheAnimal: '¡Empareja el animal con su sonido o hábitat!',
      completeThePattern: '¿Qué sigue en este patrón divertido?',
      findMatchingPairs: '¡Voltea cartas para encontrar parejas iguales!',
      allLevelsCompleted: '¡Has dominado esta aventura!',
      mod_number_adventure: 'Aventura de Números',
      mod_number_desc: 'Conteo, números y sumas divertidas',
      mod_shape_explorer: 'Explorador de Figuras',
      mod_shape_desc: 'Círculos, estrellas, cuadrados y siluetas',
      mod_color_quest: 'Búsqueda del Color',
      mod_color_desc: 'Colores del arcoíris y clasificación',
      mod_animal_world: 'Mundo Animal',
      mod_animal_desc: 'Animalitos tiernos, sonidos y hábitats',
      mod_logic_puzzle: 'Puzles Lógicos',
      mod_logic_desc: 'Patrones visuales, tamaños y secuencias',
      mod_memory_challenge: 'Desafío de Memoria',
      mod_memory_desc: 'Cartas gemelas y memoria visual',
      awesome: '¡Genial!',
      superStar: '¡Súper Estrella!',
      correct: '¡Correcto!',
      keepGoing: '¡Sigue Así!',
      youGotIt: '¡Lo Lograste!',
      offlineModeNotice: '100% Sin Conexión: Sin internet, sin cuentas y sin rastreo.',
      dataSafetyBadge: 'Verificado Seguro para Niños (COPPA / GDPR-K)',
    },
  },
  fr: {
    label: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    strings: {
      appName: 'Aventure WonderTots',
      tagline: 'Des jeux éducatifs joyeux, sécurisés et hors-ligne pour les petits curieux !',
      playNow: 'Commencer à Jouer',
      continueGame: 'Continuer',
      selectModule: 'Choisis une Aventure',
      selectLevel: 'Sélectionner le Niveau',
      level: 'Niveau',
      stars: 'Étoiles',
      totalStars: 'Étoiles Totales',
      stickers: 'Livre d’Autocollants',
      parentZone: 'Espace Parents',
      parentSettings: 'Paramètres & Confidentialité',
      parentGateTitle: 'Vérification Adulte',
      parentGateHint: 'Résous ce calcul simple pour accéder aux paramètres :',
      parentGateFailed: 'Réponse incorrecte. Essaie encore.',
      sound: 'Effets Sonores',
      voice: 'Narration Vocale',
      volume: 'Volume',
      highContrast: 'Mode Contraste Élevé',
      reducedMotion: 'Mouvement Réduit',
      speechRate: 'Vitesse de Narration',
      resetProgress: 'Réinitialiser le Progrès',
      resetConfirm: 'Voulez-vous vraiment effacer tous les progrès ? Cette action est irréversible.',
      resetSuccess: 'Les progrès ont été réinitialisés.',
      exportData: 'Sauvegarder les Données (JSON)',
      importData: 'Restaurer la Sauvegarde',
      importSuccess: 'Progrès restauré avec succès !',
      importError: 'Fichier de sauvegarde non valide.',
      privacyPolicy: 'Politique de Confidentialité Enfants',
      safetyCompliance: 'Conformité Google Play Famille',
      back: 'Retour',
      home: 'Accueil',
      nextLevel: 'Niveau Suivant',
      playAgain: 'Rejouer',
      greatJob: 'Formidable !',
      wellDone: 'Bravo !',
      tryAgain: 'Presque ! Réessaie encore.',
      touchToCount: 'Touche chaque objet pour compter, puis choisis le bon chiffre !',
      matchTheShape: 'Trouve la forme qui correspond à la silhouette !',
      findTheColor: 'Touche tous les objets de cette couleur !',
      findTheAnimal: 'Associe l’animal avec son cri ou son habitat !',
      completeThePattern: 'Que vient-il ensuite dans cette suite ?',
      findMatchingPairs: 'Retourne les cartes pour trouver les paires identiques !',
      allLevelsCompleted: 'Tu as réussi toute l’aventure !',
      mod_number_adventure: 'Aventure des Nombres',
      mod_number_desc: 'Compter, reconnaître les chiffres & additions douces',
      mod_shape_explorer: 'Explorateur de Formes',
      mod_shape_desc: 'Cercles, triangles, étoiles & ombres',
      mod_color_quest: 'Quête des Couleurs',
      mod_color_desc: 'Couleurs de l’arc-en-ciel et tri joyeux',
      mod_animal_world: 'Monde des Animaux',
      mod_animal_desc: 'Animaux mignons, sons & leurs habitats',
      mod_logic_puzzle: 'Casse-Tête Logique',
      mod_logic_desc: 'Suites visuelles, tailles et déductions',
      mod_memory_challenge: 'Défi Mémoire',
      mod_memory_desc: 'Paires cachées et mémoire visuelle',
      awesome: 'Super !',
      superStar: 'Super Étoile !',
      correct: 'Correct !',
      keepGoing: 'Continue !',
      youGotIt: 'Tu as Réussi !',
      offlineModeNotice: '100% Hors-Ligne : Sans connexion, sans compte, sans pistage.',
      dataSafetyBadge: 'Sécurité Enfants Validée (COPPA / GDPR-K)',
    },
  },
  bn: {
    label: 'Bangla',
    nativeName: 'বাংলা',
    dir: 'ltr',
    strings: {
      appName: 'ওয়ান্ডার টটস লার্নিং কোয়েস্ট',
      tagline: 'ছোট্ট বন্ধুদের জন্য আনন্দময়, নিরাপদ ও অফলাইন শিক্ষামূলক খেলা!',
      playNow: 'খেলা শুরু করি',
      continueGame: 'চালিয়ে যাও',
      selectModule: 'একটি অ্যাডভেঞ্চার বেছে নাও',
      selectLevel: 'লেভেল নির্বাচন',
      level: 'লেভেল',
      stars: 'তারা',
      totalStars: 'মোট তারা',
      stickers: 'স্টিকার অ্যালবাম',
      parentZone: 'অভিভাবক এলাকা',
      parentSettings: 'অভিভাবক সেটিংস ও গোপনীয়তা',
      parentGateTitle: 'অভিভাবক যাচাইকরণ',
      parentGateHint: 'সেটিংসে যেতে দয়া করে এই সহজ অঙ্কের সমাধান করুন:',
      parentGateFailed: 'উত্তরটি সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।',
      sound: 'সাউন্ড ইফেক্টস',
      voice: 'কণ্ঠ নির্দেশিকা',
      volume: 'ভলিউম',
      highContrast: 'উচ্চ বৈসাদৃশ্য মোড',
      reducedMotion: 'ধীর অ্যানিমেশন',
      speechRate: 'কণ্ঠের গতি',
      resetProgress: 'খেলার অগ্রগতি রিসেট করুন',
      resetConfirm: 'আপনি কি নিশ্চিত যে সমস্ত অগ্রগতি রিসেট করতে চান? এটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।',
      resetSuccess: 'অগ্রগতি সফলভাবে রিসেট করা হয়েছে।',
      exportData: 'সংরক্ষণ ফাইল ব্যাকআপ (JSON)',
      importData: 'সংরক্ষণ পুনরুদ্ধার',
      importSuccess: 'খেলার অগ্রগতি সফলভাবে পুনরুদ্ধার করা হয়েছে!',
      importError: 'অকার্যকর ফাইল ফরম্যাট।',
      privacyPolicy: 'শিশু গোপনীয়তা নীতি (COPPA ও GDPR-K)',
      safetyCompliance: 'গুগল প্লে ফ্যামিলি কমপ্লায়েন্স',
      back: 'পেছনে',
      home: 'হোম',
      nextLevel: 'পরবর্তী লেভেল',
      playAgain: 'আবার খেলি',
      greatJob: 'চমৎকার কাজ!',
      wellDone: 'দারুণ হয়েছে!',
      tryAgain: 'কাছাকাছি ছিলে! আবার চেষ্টা করো।',
      touchToCount: 'গুণতে প্রতিটি ছবিতে ট্যাপ করো, তারপর সঠিক সংখ্যাটি বেছে নাও!',
      matchTheShape: 'সিলুয়েট বা ছায়ার সাথে মিল রেখে সঠিক আকারটি মেলাও!',
      findTheColor: 'এই রঙের সবগুলো জিনিস খুঁজে বের করো!',
      findTheAnimal: 'পশুটিকে তার ডাক বা বাসস্থানের সাথে মেলাও!',
      completeThePattern: 'প্যাটার্নে এরপরে কোনটি আসবে?',
      findMatchingPairs: 'কার্ড উল্টে জোড়া বা মিল খুঁজে নাও!',
      allLevelsCompleted: 'তুমি এই অ্যাডভেঞ্চার জয় করেছ!',
      mod_number_adventure: 'সংখ্যার অভিযান',
      mod_number_desc: 'গণনা, সংখ্যা চেনা এবং সহজ যোগ',
      mod_shape_explorer: 'আকারের বিশ্ব',
      mod_shape_desc: 'বৃত্ত, ত্রিভুজ, তারা এবং আকার চেনা',
      mod_color_quest: 'রঙের মেলা',
      mod_color_desc: 'রংধনু রং, বাছাই এবং মিলকরণ',
      mod_animal_world: 'প্রাণী রাজ্য',
      mod_animal_desc: 'প্রিয় পশুপাখি, তাদের ডাক ও বাসস্থান',
      mod_logic_puzzle: 'বুদ্ধির ধাঁধা',
      mod_logic_desc: 'প্যাটার্ন, আকার ও যৌক্তিক ক্রম',
      mod_memory_challenge: 'স্মৃতি খেলা',
      mod_memory_desc: 'কার্ড মিলকরণ ও দৃষ্টিশক্তি বাড়ানোর খেলা',
      awesome: 'দুর্দান্ত!',
      superStar: 'সুপার স্টার!',
      correct: 'সঠিক হয়েছে!',
      keepGoing: 'চালিয়ে যাও!',
      youGotIt: 'তুমি পেরেছো!',
      offlineModeNotice: '১০০% অফলাইন: কোনো ইন্টারনেট, অ্যাকাউন্ট বা ট্র্যাকিং নেই।',
      dataSafetyBadge: 'কোপা ও জিডিপিআর-কে শিশু সুরক্ষা সনদপ্রাপ্ত',
    },
  },
};
