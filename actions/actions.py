# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions
from rasa_sdk import Action

from rasa_sdk.events import SlotSet


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

# class ActionRespondAboutCollege(Action):
#     def name(self):
#         return "action_respond_about_college"
#
#     def run(self, dispatcher, tracker, domain):
#         college_info = """Walchand College of Engineering, located in Sangli, Maharashtra, India, is a renowned institution dedicated to the pursuit of academic excellence in the field of engineering."""
#         dispatcher.utter_message(college_info)
#         return [SlotSet("college_info", college_info)]
#
#
# class ActionRespondAboutTheFounders(Action):
#     def name(self):
#         return "action_respond_about_college"
