const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Translation service using Google Gemini API
 * Implements the core translation logic for the "Translate on Write" strategy
 */

/**
 * Get translations for a given text in multiple target languages
 * @param {string} originalText - The text to translate
 * @param {string[]} targetLanguages - Array of language codes to translate to
 * @returns {Object} Map of language codes to translated text
 */
const getTranslations = async (originalText, targetLanguages) => {
  try {
    const translations = new Map();
    
    console.log(`Translating: "${originalText}" to languages:`, targetLanguages);

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a single prompt for all translations
    const languageNames = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'ru': 'Russian',
      'hi': 'Hindi'
    };

    const targetLanguageNames = targetLanguages.map(lang => languageNames[lang] || lang);
    
    // Optimize prompt for single language translation
    const prompt = targetLanguages.length === 1 
      ? `Translate the following text from English to ${targetLanguageNames[0]}.

Text to translate: "${originalText}"

Please provide only the translated text, no additional formatting or explanation.`
      : `Translate the following text into these languages: ${targetLanguageNames.join(', ')}.

Text to translate: "${originalText}"

Please provide the translations in this exact JSON format:
{
  "${targetLanguages[0]}": "translation1",
  "${targetLanguages[1]}": "translation2",
  ...
}

Only return the JSON object, no other text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (targetLanguages.length === 1) {
        // Single language translation - return plain text
        const cleanText = text.replace(/```|"/g, '').trim();
        translations.set(targetLanguages[0], cleanText);
      } else {
        // Multiple languages - parse JSON response
        const cleanText = text.replace(/```json|```/g, '').trim();
        const translationsObject = JSON.parse(cleanText);
        
        // Validate that we got translations for all requested languages
        targetLanguages.forEach(lang => {
          if (translationsObject[lang]) {
            translations.set(lang, translationsObject[lang]);
          } else {
            // Fallback to original text if translation missing
            translations.set(lang, originalText);
          }
        });
      }

      console.log('Generated translations:', Object.fromEntries(translations));
      return Object.fromEntries(translations);

    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      
      // Fallback to mock translations if API fails
      const mockTranslations = {
        'en': originalText,
        'es': `[ES] ${originalText}`,
        'fr': `[FR] ${originalText}`,
        'de': `[DE] ${originalText}`,
        'it': `[IT] ${originalText}`,
        'pt': `[PT] ${originalText}`,
        'ja': `[JA] ${originalText}`,
        'ko': `[KO] ${originalText}`,
        'zh': `[ZH] ${originalText}`,
        'ar': `[AR] ${originalText}`,
        'ru': `[RU] ${originalText}`,
        'hi': `[HI] ${originalText}`
      };

      targetLanguages.forEach(lang => {
        translations.set(lang, mockTranslations[lang] || `[${lang.toUpperCase()}] ${originalText}`);
      });

      return Object.fromEntries(translations);
    }

  } catch (error) {
    console.error('Translation error:', error);
    
    // Final fallback: return original text for all languages
    const fallbackTranslations = {};
    targetLanguages.forEach(lang => {
      fallbackTranslations[lang] = originalText;
    });
    
    return fallbackTranslations;
  }
};

/**
 * Detect the language of a given text
 * @param {string} text - The text to analyze
 * @returns {string} Detected language code
 */
const detectLanguage = async (text) => {
  try {
    // TODO: Implement language detection using Gemini API
    // This could be useful for optimizing translation requests
    
    // Placeholder: assume English for now
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default fallback
  }
};

/**
 * Get supported languages
 * @returns {string[]} Array of supported language codes
 */
const getSupportedLanguages = () => {
  return [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'ru', 'hi'
  ];
};

module.exports = {
  getTranslations,
  detectLanguage,
  getSupportedLanguages
};
