from rasa_sdk import Action

class ActionDefaultFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("I'm sorry, currently i don't have access to this information. Please try again or ask another question ")
