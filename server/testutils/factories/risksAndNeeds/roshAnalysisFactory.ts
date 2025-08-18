import { RoshAnalysis } from '@manage-and-deliver-api'
import { Factory } from 'fishery'

class RoshAnalysisFactory extends Factory<RoshAnalysis> {}

export default RoshAnalysisFactory.define(() => ({
  assessmentCompleted: '1 August 2024',
  offenceDetails: 'Tax evasion',
  whereAndWhen: 'At home',
  howDone:
    'Appears to have been unprovoked violence - although basis of plea indicates otherwise. In any event this was impulsive, excessive violence using a weapon (metal pole)',
  whoVictims:
    'Male-outnumbered by Mr Manette and his associate (not charged). The victims girlfriend was present and alerted the police.  She has maintained that she has been left with significant anxiety issues since the offence, as has the victim.',
  anyoneElsePresent:
    'See above - Mr Manette was in the company of another, although he was not apprehended or charged for this offence. ',
  whyDone:
    'Ms Puckett stated that as she had been attempting to address her long standing addiction to heroin, with the support of a Drug Rehabilitation Requirement as part of a community order, he had been using cannabis as a substitute in order to assuage symptoms of withdrawal or stress.  She had said that the deal to purchase cannabis had been set up by a third party and that he had not met the victim prior to the offence.  She recalled paying for cannabis only to find that it had been clearly mixed with cooking herbs 9sage) and getting into an altercation which escalated when the victim refused to reimburse him. She admitted to instigating violence in the first place by punching the victim, out of a mixture of frustration and anger. She said that the situation quickly got out of control when the victim produced a metal bar and hit him with it.',
  sources: 'Interview, CPS documentation, basis of plea.',
  identifyBehavioursIncidents:
    'Physical assault on cellmate requiring medical attention on 22nd March 2024. Weapon possession (improvised blade) discovered during cell search on 8th February 2024.',
  analysisBehaviourIncidents:
    'Escalating violence in evenings when challenged, targeting vulnerable individuals, causing injuries requiring medical attention.',
}))
