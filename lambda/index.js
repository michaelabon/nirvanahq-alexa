  // Alexa Fact Skill - Sample for Beginners
  /* eslint no-use-before-define: 0 */
  // sets up dependencies
  const Alexa = require('ask-sdk-core');
  const i18n = require('i18next');
  const sprintf = require('i18next-sprintf-postprocessor');

  const LaunchHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      // checks request type
      return request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      const welcomeMessage = requestAttributes.t('WELCOME_MESSAGE')

      return handlerInput.responseBuilder
        .speak(welcomeMessage)
        .withSimpleCard(requestAttributes.t('SKILL_NAME'), welcomeMessage)
        .getResponse();
    }
  }
  const AddDirectTaskHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      // checks request type
      return request.type === 'IntentRequest' &&
          request.intent.name === 'AddDirectTaskIntent' &&
          request.intent.slots.todo;
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      const todo = request.intent.slots.todo.value
      
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      
      // gets a random fact by assigning an array to the variable
      // the random item from the array will be selected by the i18next library
      // the i18next library is set up in the Request Interceptor
      
      const successMessage = requestAttributes.t('SUCCESS_MESSAGE', todo)
      // concatenates a standard message with the random fact

      return handlerInput.responseBuilder
        .speak(successMessage)
        .withSimpleCard(requestAttributes.t('SKILL_NAME'), successMessage)
        .getResponse();
      },
    };
    
  const HelpHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('HELP_MESSAGE'))
        .reprompt(requestAttributes.t('HELP_REPROMPT'))
        .getResponse();
    },
  };

  const FallbackHandler = {
    // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
    //              This handler will not be triggered except in those locales, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('FALLBACK_MESSAGE'))
        .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
        .getResponse();
    },
  };

  const ExitHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.CancelIntent'
          || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('STOP_MESSAGE'))
        .getResponse();
    },
  };

  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
      return handlerInput.responseBuilder.getResponse();
    },
  };

  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      console.log(`Error stack: ${error.stack}`);
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MESSAGE'))
        .reprompt(requestAttributes.t('ERROR_MESSAGE'))
        .getResponse();
    },
  };

  const LocalizationInterceptor = {
    process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
        lng: handlerInput.requestEnvelope.request.locale,
        resources: languageStrings,
      });
      localizationClient.localize = function localize() {
        const args = arguments;
        const values = [];
        for (let i = 1; i < args.length; i += 1) {
          values.push(args[i]);
        }
        const value = i18n.t(args[0], {
          returnObjects: true,
          postProcess: 'sprintf',
          sprintf: values,
        });
        if (Array.isArray(value)) {
          return value[Math.floor(Math.random() * value.length)];
        }
        return value;
      };
      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function translate(...args) {
        return localizationClient.localize(...args);
      };
    },
  };

  const skillBuilder = Alexa.SkillBuilders.custom();

  exports.handler = skillBuilder
    .addRequestHandlers(
      LaunchHandler,
      AddDirectTaskHandler,
      HelpHandler,
      ExitHandler,
      FallbackHandler,
      SessionEndedRequestHandler,
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();

  // translations
  const enData = {
    translation: {
      SKILL_NAME: 'NirvanaHQ (unofficial)',
      SUCCESS_MESSAGE: [
        "Great! I've added \"%s\" to your Nirvana inbox."
      ],
      WELCOME_MESSAGE: 'Welcome to Nirvana. You can say something like, "Add Book a reservation to my to-dos," and I’ll add it to your Nirvana inbox.',
      HELP_MESSAGE: 'You can say "Add pickup dry-cleaning", or, "Add Call my bank to my to-do list."',
      HELP_REPROMPT: 'What would you like to add to your to-do list?',
      FALLBACK_MESSAGE: 'The Nirvana skill can\'t help you with that.  It can help you add a new to-do to your Nirvana HQ inbox if you say "Add Book my flights". What can I help you with?',
      FALLBACK_REPROMPT: 'What can I help you with?',
      ERROR_MESSAGE: 'Sorry, an error occurred.',
      STOP_MESSAGE: 'Goodbye!',
    },
  };


  // constructs i18n and l10n data structure
  // translations for this sample can be found at the end of this file
  const languageStrings = {
    'en': enData,
  };
