## Alexa Skill Review Checker

Returns the amount of reviews and voice ratings for an AlexaSkill

#### Installation

```shell script
git clone https://github.com/aswetlow/skill-review-checker.git
npm install
```

#### Usage

Add your skill to the skills object.
```javascript
const skills = {
    'SkillName': '<url-to-skill-page>',
};
```

Run script.
```shell script
> node index.js

SkillName: 4.6 - 13 reviews / 57 voice ratings
```


