import { useEffect, useState } from "react";
import Header from "../components/Header";

const transcript = [
  { speaker: "A", text: "Thank you very much for taking the time to meet with me in person.", timestamp: "00:00:00,000 → 00:00:05,000" },
  { speaker: "A", text: "My research looks at how ecological knowledge is produced under conditions of occupation, especially through practices of sensing and monitoring and care.", timestamp: "00:00:05,000 → 00:00:10,000" },
  { speaker: "A", text: "I'm interested in how scientists, researchers, and communities continue to observe and protect life when access to land, technology, and mobility is restricted.", timestamp: "00:00:10,000 → 00:00:14,000" },
  { speaker: "A", text: "Your work has been extremely important for me in understanding how biodiversity research in Palestine is not only scientific, but also ethical and political in practice.", timestamp: "00:00:14,000 → 00:00:18,000" },
  { speaker: "A", text: "I was especially drawn to the way you combine rigorous research of education, community involvement, and long-term commitment to the land.", timestamp: "00:00:18,000 → 00:00:22,000" },
  { speaker: "A", text: "And I'm grateful for the chance to learn from your experience, and I'd like to begin by inviting you to introduce yourself in your own words.", timestamp: "00:00:22,000 → 00:00:26,000" },
  { speaker: "B", text: "Okay, so I'm as you can see, I'm a professor, so to speak.", timestamp: "00:00:26,000 → 00:00:30,000" },
  { speaker: "B", text: "I don't teach anymore, and I'm retired in the sense that I don't get a salary from anybody.", timestamp: "00:00:30,000 → 00:00:35,000" },
  { speaker: "B", text: "I'm a full-time volunteer here, I'm founder and director of this institute called the Palestine Institute for Biodiversity and Sustainability at Bethlehem University, which we started in 2014 with a vision for sustainable human and natural communities.", timestamp: "00:00:35,000 → 00:00:38,000" },
  { speaker: "B", text: "So I've been in the field of biology and biodiversity for over four decades, and now I am just full-time dedicated volunteerism overseeing a transition in this institute with the new museum and so on.", timestamp: "00:00:38,000 → 00:00:41,000" },
  { speaker: "A", text: "Can you describe what your current role and area of focus is?", timestamp: "00:00:41,000 → 00:00:45,000" },
  { speaker: "B", text: "My role here is basically to work on several areas of the institute that I am knowledgeable about.", timestamp: "00:00:45,000 → 00:00:53,000" },
  { speaker: "B", text: "The institute focuses on four areas basically, research, education or learning, community service and conservation efforts. Those are the four areas we focus on.", timestamp: "00:00:53,000 → 00:01:00,000" },
  { speaker: "B", text: "Let's start with research. On research areas, I oversee the research projects that happen here.", timestamp: "00:01:00,000 → 00:01:07,000" },
  { speaker: "B", text: "Last year we published 22 articles, research papers. Hopefully this year we will do even more.", timestamp: "00:01:07,000 → 00:01:14,000" },
  { speaker: "B", text: "Most of our research is applied research related to basically how we conserve our environment, how we get this vision realized as a set of sustainable human and natural communities.", timestamp: "00:01:14,000 → 00:01:23,000" },
  { speaker: "B", text: "In terms of education, like today there will be a group of children coming.", timestamp: "00:01:23,000 → 00:01:29,000" },
  { speaker: "B", text: "I don't oversee our education projects. There are other people like Sarah and Amal and Zaina that are working on these things, but I do help in the overall structure of the educational component.", timestamp: "00:01:29,000 → 00:01:41,000" },
  { speaker: "B", text: "Certainly one of the educational components is using a museum and botanical garden as modules for education, how we can educate people via these systems.", timestamp: "00:01:41,000 → 00:01:45,000" },
  { speaker: "B", text: "So in that sense I look at how we are going to exhibit things, what are the messages that we are trying to exhibit at the Natural History Museum, at the ethnography section and so on. That's in terms of education.", timestamp: "00:01:45,000 → 00:01:50,000" },
  { speaker: "B", text: "In terms of the community service, we have some projects like with National Geographic Society and Darwin Initiative.", timestamp: "00:01:50,000 → 00:02:00,000" },
  { speaker: "B", text: "We had the project funded by the European Union to allow us to spend some money working with the communities, empowering them, community led efforts basically to help themselves.", timestamp: "00:02:00,000 → 00:02:08,000" },
  { speaker: "B", text: "So they are always involved in the planning of these projects and they are involved in how these projects are run.", timestamp: "00:02:08,000 → 00:02:16,000" },
  { speaker: "B", text: "This helps them and their communities.", timestamp: "00:02:16,000 → 00:02:23,000" },
  { speaker: "B", text: "And in conservation efforts, again we work with the community also for nature conservation and we work to study, research and educate about particular vulnerable areas, particular protected areas.", timestamp: "00:02:23,000 → 00:02:32,000" },
  { speaker: "B", text: "We were the ones who designated the protected area network for the state of Palestine, the limiting where these national parks are, how to protect them, how to engage the community in protecting them and what to do, what species are most critical.", timestamp: "00:02:32,000 → 00:02:40,000" },
  { speaker: "B", text: "So these are the various areas that I try to guide and oversee in some areas, run some projects.", timestamp: "00:02:40,000 → 00:02:52,000" },
  { speaker: "B", text: "I do have also some aspects of other ancillary functions like public relations and communication to the global community.", timestamp: "00:02:52,000 → 00:02:57,000" },
  { speaker: "B", text: "I give a few talks every week, five or six talks. I do interviews like this one.", timestamp: "00:02:57,000 → 00:03:05,000" },
  { speaker: "B", text: "This is public relations. This is an area that we need to do more of, obviously, to send a message out.", timestamp: "00:03:05,000 → 00:03:18,000" },
  { speaker: "B", text: "And what's the message? The message is that we need human conservation, we need natural conservation.", timestamp: "00:03:18,000 → 00:03:28,000" },
  { speaker: "A", text: "So looking back, what originally drew you to biology and biodiversity research?", timestamp: "00:03:28,000 → 00:03:33,000" },
  { speaker: "B", text: "I'm sorry, what originally?", timestamp: "00:03:33,000 → 00:03:43,000" },
  { speaker: "A", text: "Looking back from your time in this work you're doing now, what drew you to biology and biodiversity research? What drove you to do this and what led you to commit to this work in Palestine specifically?", timestamp: "00:03:43,000 → 00:03:52,000" },
  { speaker: "B", text: "Well, I have been in love with nature since my childhood.", timestamp: "00:03:52,000 → 00:04:02,000" },
  { speaker: "B", text: "I used to go to the valleys around Bethlehem with my mother, my uncle.", timestamp: "00:04:02,000 → 00:04:10,000" },
  { speaker: "B", text: "We collect wild plants, herbal medicinal plants, study nature with my uncle who was the first Palestinian zoologist.", timestamp: "00:04:10,000 → 00:04:17,000" },
  { speaker: "B", text: "So that's how I learned to love nature.", timestamp: "00:04:17,000 → 00:04:27,000" },
  { speaker: "B", text: "But in terms of biology and biodiversity and so forth, you have to also realize that in our case, which is a fairly unique case, since we are basically the last colonial apartheid regime on earth that's still functioning, we have a system of oppression and ethnic cleansing and attack on our environment from the colonizers, attack on our people from the colonizer.", timestamp: "00:04:27,000 → 00:04:31,000" },
  { speaker: "B", text: "As indigenous people, indigenous people are always tied to the land.", timestamp: "00:04:31,000 → 00:04:38,000" },
  { speaker: "B", text: "And what the colonizers want to do is obliterate, destroy the indigenous people and destroy our connection with the land.", timestamp: "00:04:38,000 → 00:04:50,000" },
  { speaker: "B", text: "So what is our job? What drives us? If you want that question that you asked, what drives us is that passion to retain our connectivity to our land, our connectivity to our people and our culture.", timestamp: "00:04:50,000 → 00:04:57,000" },
  { speaker: "B", text: "Usually colonizers, wherever they are, British colonizers, for example, in Australia or North America and what became the United States, are interested in destroying both human diversity and biological diversity, human diversity and biological diversity, and creating monolithic culture, you know, English speaking, for example, whatever.", timestamp: "00:04:57,000 → 00:05:07,000" },
  { speaker: "B", text: "The indigenous people love what they have, which is biological diversity for nature and human diversity, different languages, different tribes of Native Americans, for example.", timestamp: "00:05:07,000 → 00:05:11,000" },
  { speaker: "B", text: "In our case also, we had the pluralistic society composed of basically humans of various religions.", timestamp: "00:05:11,000 → 00:05:21,000" },
  { speaker: "B", text: "We were multireligious, multiethnic, multicultural, even multilingual.", timestamp: "00:05:21,000 → 00:05:34,000" },
  { speaker: "B", text: "Before 1948, there were 44 languages spoken in Palestine.", timestamp: "00:05:34,000 → 00:05:41,000" },
  { speaker: "B", text: "The idea of Zionism and colonialism is to remove this pluralistic society and create a monolithic society.", timestamp: "00:05:41,000 → 00:05:51,000" },
  { speaker: "B", text: "In this particular case, in our region, it is to make a Jewish state with Jewish culture, Jewish religion, Jewish language, Hebrew.", timestamp: "00:05:51,000 → 00:06:02,000" },
  { speaker: "B", text: "And that's it. No other, no space for other people.", timestamp: "00:06:02,000 → 00:06:06,000" },
  { speaker: "B", text: "So this struggle between the indigenous people and what they want and the colonizers and what they want, we are at that, at that nexus of the struggle.", timestamp: "00:06:06,000 → 00:06:08,000" },
  { speaker: "B", text: "We as an institute work to, to enhance biological diversity and enhance cultural and religious and political and human diversity, as it was before the colonization accelerated after the foundation of the State of Israel in 1948.", timestamp: "00:06:08,000 → 00:06:16,000" },
  { speaker: "A", text: "So much your work relies on field observation, citizen science and community participation.", timestamp: "00:06:56,000 → 00:07:08,000" },
  { speaker: "A", text: "How do you think about sensing and monitoring nature and when advanced technologies are unavailable or controlled elsewhere?", timestamp: "00:07:08,000 → 00:07:16,000" },
  { speaker: "B", text: "That's a very good question and something we have to actually it's on our priorities for the coming year or two.", timestamp: "00:07:16,000 → 00:07:19,000" },
  { speaker: "B", text: "Now the availability of artificial intelligence and, you know, these modern tools that are available technologically, they are being used for oppression, but they can be used for good, like everything else, like computers, like Internet.", timestamp: "00:07:19,000 → 00:07:24,000" },
  { speaker: "B", text: "It can be used for bad purposes. It can be used for good purposes. It can be used to defend the indigenous people, for example.", timestamp: "00:07:24,000 → 00:07:34,000" },
  { speaker: "B", text: "So I think that you excuse me, the use of technology is a critical component of our work, even when they try to restrict it.", timestamp: "00:07:34,000 → 00:07:41,000" },
  { speaker: "B", text: "For example, Israel has allowed us 3G only in 2018 or something long.", timestamp: "00:07:41,000 → 00:07:51,000" },
  { speaker: "B", text: "We were the last country to get 3G and we're still at 3G.", timestamp: "00:07:51,000 → 00:08:04,000" },
  { speaker: "B", text: "This week they said they are going to give us fourth generation Internet access and people have been on fifth generation long time ago.", timestamp: "00:08:04,000 → 00:08:14,000" },
  { speaker: "B", text: "So, you know, the attempts to restrict us, to control us, to manage us electronically, facial recognition is very famous here.", timestamp: "00:08:14,000 → 00:08:20,000" },
  { speaker: "B", text: "Every move we make, even this interview is being recorded, sent to the Israeli Mossad because all the phones we use, all our phones are basically bugged.", timestamp: "00:08:20,000 → 00:08:30,000" },
  { speaker: "B", text: "There's actually there's a friend of mine, Basil Khoury, who's going to come.", timestamp: "00:09:25,000 → 00:09:38,000" },
  { speaker: "B", text: "Amal, today I wanted him to talk to you and to us about Internet security and things like that.", timestamp: "00:09:38,000 → 00:09:54,000" },
  { speaker: "B", text: "How we can guard against some of the infiltrations and attempt to destroy our work.", timestamp: "00:09:54,000 → 00:10:05,000" },
  { speaker: "B", text: "And they do try to impact us.", timestamp: "00:10:08,000 → 00:10:23,000" },
  { speaker: "B", text: "I mean, for example, I'll give you a very simple example.", timestamp: "00:10:23,000 → 00:10:25,000" },
  { speaker: "B", text: "Everything that goes inside the West Bank goes through Israel.", timestamp: "00:10:25,000 → 00:10:26,000" },
  { speaker: "B", text: "All our supplies basically have to go through Israel.", timestamp: "00:10:26,000 → 00:10:30,000" },
  { speaker: "B", text: "And many times they won't allow these things.", timestamp: "00:10:30,000 → 00:10:41,000" },
  { speaker: "B", text: "So most of our equipment and supplies here, what we do is we find ways to bring it through, for example, some Israeli friends.", timestamp: "00:10:41,000 → 00:10:46,000" },
  { speaker: "B", text: "Or some international volunteers who bring them with them in the airport.", timestamp: "00:10:46,000 → 00:10:52,000" },
  { speaker: "B", text: "So we have to always be flexible and always think of how best to finish, do the job.", timestamp: "00:10:52,000 → 00:11:02,000" },
  { speaker: "B", text: "Despite all the incredible odds that we are facing as indigenous people.", timestamp: "00:11:02,000 → 00:11:11,000" },
  { speaker: "A", text: "OK, so this goes now like when there is no top technology available.", timestamp: "00:11:11,000 → 00:11:24,000" },
  { speaker: "A", text: "What role does the body, the human senses, such as walking, listening, observing, play as a scientific instrument in your research practice?", timestamp: "00:11:24,000 → 00:11:29,000" },
  { speaker: "A", text: "Because even when you are reduced with less technology, we still have our human senses.", timestamp: "00:11:29,000 → 00:11:39,000" },
  { speaker: "B", text: "Yeah, I tell people actually, you know, I am a fan of this concept called mindfulness.", timestamp: "00:11:39,000 → 00:11:53,000" },
  { speaker: "B", text: "We humans must be mindful and be immersed in our society, employing all our five senses.", timestamp: "00:11:53,000 → 00:12:06,000" },
  { speaker: "B", text: "And this is part of what we do with children.", timestamp: "00:12:06,000 → 00:12:12,000" },
  { speaker: "B", text: "We ask children, we don't teach them in the sense we don't give them a talk or a lecture or anything like that.", timestamp: "00:12:12,000 → 00:12:22,000" },
  { speaker: "B", text: "We create an environment for children to learn.", timestamp: "00:12:22,000 → 00:12:35,000" },
  { speaker: "B", text: "Just like I, yesterday I was planting some seeds and so forth before the rain.", timestamp: "00:12:35,000 → 00:12:51,000" },
  { speaker: "B", text: "The idea is to create an environment for the seeds to grow.", timestamp: "00:12:51,000 → 00:12:53,000" },
  { speaker: "B", text: "Soil, water, you know, air, sunlight.", timestamp: "00:12:53,000 → 00:12:58,000" },
  { speaker: "B", text: "And then they grow. And same with humans.", timestamp: "00:12:58,000 → 00:13:02,000" },
  { speaker: "B", text: "Humans grow their minds, grow their spirits, grow their bodies, their physical bodies by being immersed in nature.", timestamp: "00:13:02,000 → 00:13:07,000" },
  { speaker: "B", text: "And the five senses are our communication channels to nature, if you want.", timestamp: "00:13:07,000 → 00:13:10,000" },
  { speaker: "B", text: "So the museum that we are building, the institute we are building, I would like it to be, we collectively, would like it to be a place like that environment we create for the plants.", timestamp: "00:13:10,000 → 00:13:16,000" },
  { speaker: "B", text: "It would be an environment we create for humans to grow, to expand, to, you know, like you raise a child, you bring some toys and things so that the children can grow physically and grow mentally and spiritually.", timestamp: "00:13:16,000 → 00:13:19,000" },
  { speaker: "B", text: "This is our aim in this institute and how we try to work.", timestamp: "00:13:19,000 → 00:13:26,000" },
  { speaker: "B", text: "There's a Chinese saying that I like, it says, I hear and I forget, I see and I remember, I do and I understand.", timestamp: "00:13:26,000 → 00:13:38,000" },
  { speaker: "B", text: "So we'd like people to do things by hand, touch, feel, listen, you know, smell.", timestamp: "00:13:38,000 → 00:13:46,000" },
  { speaker: "B", text: "This is how they understand their life and understand the people.", timestamp: "00:13:46,000 → 00:13:49,000" },
  { speaker: "A", text: "Have you noticed any changes in species behaviors, seasonal rhythms and biodiversity that are not adequately captured by international environmental narratives?", timestamp: "00:13:57,000 → 00:14:03,000" },
  { speaker: "A", text: "For example, the West who have a privilege in capturing environmental data, such as species behavior, seasonal rhythms or biodiversity, what do you think is not adequately captured by international environmental narratives? What stories do international environmental narratives bring that are not correct or not showing the full situation?", timestamp: "00:14:06,000 → 00:14:15,000" },
  { speaker: "B", text: "I was reading a book yesterday on the Internet called I'm a recovering environmentalist.", timestamp: "00:14:15,000 → 00:14:21,000" },
  { speaker: "B", text: "It's kind of tongue-in-cheek title by an environmentalist actually who realized he's Western, I think he's Australian.", timestamp: "00:14:21,000 → 00:14:30,000" },
  { speaker: "B", text: "He was explaining how environmentalism globally has become very narrow.", timestamp: "00:14:30,000 → 00:14:38,000" },
  { speaker: "B", text: "For example, focusing only on climate change, saying climate change is the problem.", timestamp: "00:14:38,000 → 00:14:46,000" },
  { speaker: "B", text: "No, it's not the problem. It's one of many problems.", timestamp: "00:14:46,000 → 00:14:55,000" },
  { speaker: "B", text: "We have invasive species, we have pollution, we have habitat destruction.", timestamp: "00:14:55,000 → 00:15:02,000" },
  { speaker: "B", text: "We have colonialism, we have wars.", timestamp: "00:15:03,000 → 00:15:12,000" },
  { speaker: "B", text: "Wars produce more greenhouse gases than people know.", timestamp: "00:15:12,000 → 00:15:24,000" },
  { speaker: "B", text: "Israel produced more greenhouse gases from bombing Gaza and seven other countries in the last two years than Spain produced from all its sources in the same period of time.", timestamp: "00:15:24,000 → 00:15:27,000" },
  { speaker: "B", text: "That's just from jet fuels, jet fuel burning and producing greenhouse gases.", timestamp: "00:15:27,000 → 00:15:36,000" },
  { speaker: "B", text: "I think we need to widen our vision of what environmentalism means.", timestamp: "00:15:36,000 → 00:15:40,000" },
  { speaker: "B", text: "Our vision here at this institution, our philosophy, and one of these days I need to write a paper about this, our philosophy of environmentalism.", timestamp: "00:15:40,000 → 00:15:47,000" },
  { speaker: "B", text: "It's a comprehensive environmentalism that guards, as I said, that biological and human diversity.", timestamp: "00:15:47,000 → 00:15:53,000" },
  { speaker: "B", text: "This is very critical.", timestamp: "00:15:53,000 → 00:15:59,000" },
  { speaker: "B", text: "I cannot have environmentalism that says, well, we have to reduce greenhouse gases, go to alternative energy, and that's my environmentalism.", timestamp: "00:15:59,000 → 00:16:02,000" },
  { speaker: "B", text: "That's limiting your environmentalism.", timestamp: "00:16:02,000 → 00:16:12,000" },
  { speaker: "B", text: "Your environmentalism should also mean that you don't let children, I mean, just last 24 hours, 15 people were killed in Gaza, five of them are children.", timestamp: "00:16:12,000 → 00:16:18,000" },
  { speaker: "B", text: "That's environmentalism. You have to be involved in that. You have to address that. You have to talk about it.", timestamp: "00:16:18,000 → 00:16:27,000" },
  { speaker: "B", text: "You cannot say, well, I'm just focusing on using my Tesla as an electric car, as if that's solving an environmental problem.", timestamp: "00:16:27,000 → 00:16:33,000" },
  { speaker: "B", text: "No, it does not solve an environmental problem.", timestamp: "00:16:33,000 → 00:16:42,000" },
  { speaker: "B", text: "You're enriching somebody, Elon Musk, who's supporting wars that's producing far more in weapons and destruction and mayhem in the world and destruction of our environment by buying that Tesla.", timestamp: "00:16:42,000 → 00:16:54,000" },
  { speaker: "B", text: "And then you are by saving on gasoline and using electricity, which electricity, of course, has to be produced from other sources of energy, whether it's fuel or nuclear or what.", timestamp: "00:16:54,000 → 00:17:02,000" },
  { speaker: "B", text: "So you have to really think and think deeper and have better understanding.", timestamp: "00:17:02,000 → 00:17:07,000" },
  { speaker: "B", text: "And this is an important point also.", timestamp: "00:17:07,000 → 00:17:14,000" },
  { speaker: "B", text: "Knowledge is power. People have to get knowledge and institutions like ours, we must, that's our role.", timestamp: "00:17:14,000 → 00:17:22,000" },
  { speaker: "B", text: "We must consider our role also to produce knowledge and disseminate knowledge.", timestamp: "00:17:22,000 → 00:17:29,000" },
  { speaker: "B", text: "Without producing and disseminating knowledge, you cannot bridge what they call the science policy practice gaps.", timestamp: "00:17:29,000 → 00:17:31,000" },
  { speaker: "B", text: "How are you going to bridge the gaps if you have poor knowledge and poor dissemination of knowledge?", timestamp: "00:17:31,000 → 00:17:36,000" },
  { speaker: "A", text: "From an ecological perspective, how do you understand the air above Palestine as habitat, corridor, or shared ecological space?", timestamp: "00:17:52,000 → 00:18:01,000" },
  { speaker: "B", text: "Well, all of the above.", timestamp: "00:18:01,000 → 00:18:07,000" },
  { speaker: "B", text: "I mean, the air is a component of the biosphere that we deal with.", timestamp: "00:18:07,000 → 00:18:13,000" },
  { speaker: "B", text: "And there are actual living organisms in the air that we breathe.", timestamp: "00:18:13,000 → 00:18:18,000" },
  { speaker: "B", text: "Animals use the air, of course, not just for breathing, but also for insects cannot survive without air.", timestamp: "00:18:18,000 → 00:18:22,000" },
  { speaker: "B", text: "Air pollution will impact everything.", timestamp: "00:18:22,000 → 00:18:31,000" },
  { speaker: "B", text: "So when you see cities that are heavily polluted, like Lahore in Pakistan, humans suffer.", timestamp: "00:18:31,000 → 00:18:42,000" },
  { speaker: "B", text: "Skin disorders increase, cancers, birth defects, infertility, abortions, all of these things increase due to pollution of the air.", timestamp: "00:18:42,000 → 00:18:50,000" },
  { speaker: "B", text: "So it is critical when we talk, as I mentioned earlier, jet fuels of Israeli airplanes who are flying all over our space here, producing all these chemicals, they're not just producing CO2, they are producing all sorts of chemicals that come to the land also via the rain.", timestamp: "00:18:50,000 → 00:18:56,000" },
  { speaker: "B", text: "For example, now we have rain, the rain brings down all those pollutants to the soil.", timestamp: "00:18:56,000 → 00:18:59,000" },
  { speaker: "B", text: "We notice, for example, globally, the acid rain is increasing.", timestamp: "00:18:59,000 → 00:19:05,000" },
  { speaker: "B", text: "The pH of the rain is becoming lower, so it's acid rain.", timestamp: "00:19:05,000 → 00:19:06,000" },
  { speaker: "B", text: "Acid rain dissolves calcium, calcium carbonates and things like that, and makes less calcium available for birds, for example, to build their shells.", timestamp: "00:19:06,000 → 00:19:09,000" },
  { speaker: "B", text: "So we see egg shells that are in nests that are fragile and break easily, not like they used to be before.", timestamp: "00:19:09,000 → 00:19:13,000" },
  { speaker: "B", text: "And they used to be much stronger, egg shells, and so the fertility among birds is declining.", timestamp: "00:19:13,000 → 00:19:21,000" },
  { speaker: "B", text: "All of this is related to air. All of this is related to the human pollution of the air.", timestamp: "00:19:21,000 → 00:19:26,000" },
  { speaker: "B", text: "And we could cite many, many other examples of this.", timestamp: "00:19:26,000 → 00:19:36,000" },
  { speaker: "B", text: "So the air is a significant component of having a healthy ecosystem.", timestamp: "00:19:36,000 → 00:19:44,000" },
  { speaker: "A", text: "Well, bird migration creates invisible networks in the sky, connecting Palestine to Africa, Europe, and Asia.", timestamp: "00:19:44,000 → 00:19:53,000" },
  { speaker: "A", text: "How important are these aerial connections for understanding Palestine's ecology?", timestamp: "00:19:53,000 → 00:19:56,000" },
  { speaker: "B", text: "I mean, also this brings up another issue.", timestamp: "00:19:56,000 → 00:20:05,000" },
  { speaker: "B", text: "You cannot talk about air and the air component of the biosphere separately from other areas.", timestamp: "00:20:05,000 → 00:20:08,000" },
  { speaker: "B", text: "Since you bring up the birds, we estimate that over 500 million birds migrated through Palestine annually to Africa and back to places in Europe and Asia, right?", timestamp: "00:20:08,000 → 00:20:17,000" },
  { speaker: "B", text: "They pass through Palestine. What do they use?", timestamp: "00:20:17,000 → 00:20:20,000" },
  { speaker: "B", text: "They use air currents coming up, for example, in the mountains and so forth, so that they conserve energy.", timestamp: "00:20:20,000 → 00:20:27,000" },
  { speaker: "B", text: "But even if they conserve energy through air currents and so forth, they still need to rest occasionally.", timestamp: "00:20:27,000 → 00:20:31,000" },
  { speaker: "B", text: "They have to land somewhere, especially to drink water.", timestamp: "00:20:31,000 → 00:20:37,000" },
  { speaker: "B", text: "And so when Israel basically dried up the wetlands of the Hula and the Lake Hula area in the north to make farmlands, European-style farmlands in the north of Palestine, this is very damaging to our environment.", timestamp: "00:20:37,000 → 00:20:48,000" },
  { speaker: "B", text: "When Israel diverted the water of the Jordan River from the east to the west, not because they really need the water, it's because they wanted to deprive the Palestinians of the water of the Jordan River Basin.", timestamp: "00:20:48,000 → 00:20:52,000" },
  { speaker: "B", text: "So Jordan River, which used to flow at 1,350 million cubic meters per year, now flows at about 20 million cubic meters per year.", timestamp: "00:20:52,000 → 00:21:04,000" },
  { speaker: "B", text: "That's barely a stream, cannot really accommodate migrating birds.", timestamp: "00:21:04,000 → 00:21:10,000" },
  { speaker: "B", text: "So what happened? We don't have enough studies, by the way, to tell what impact all of these things had on bird migration.", timestamp: "00:21:10,000 → 00:21:19,000" },
  { speaker: "B", text: "So it's not just the earth, the air, but also the land, the water, the hunting, all of these things, threats to our ecosystem, to our global ecosystem, to our Mother Earth.", timestamp: "00:21:19,000 → 00:21:24,000" },
  { speaker: "B", text: "We, the indigenous people, we call it Mother Earth because we believe it's sacred and that we have to respect Mother Earth, not to destroy Mother Earth.", timestamp: "00:21:24,000 → 00:21:31,000" },
  { speaker: "B", text: "So every aspect of Mother Earth is under assault these days because of rampant capitalism, neoliberal attitudes, colonialism, imperialism, Zionism, all these isms that are assaulting our nature, our human nature and our biological nature.", timestamp: "00:21:31,000 → 00:21:34,000" },
  { speaker: "A", text: "I recently went to the Kasseria archaeological site in the desert Al-Zarqa, and there was a fish farming site where there were so many birds because of all the fish.", timestamp: "00:21:34,000 → 00:21:44,000" },
  { speaker: "A", text: "But it almost looked like a bird monitoring site because there were so many birds. Do you know much about this?", timestamp: "00:21:44,000 → 00:21:50,000" },
  { speaker: "B", text: "Well, I mean, birds adjust a little bit and when you have fish farming or even artificial lakes land on them, even trash dump sites in the Jordan Valley, bird migrations settle around trash dump sites, thinking they can find something edible in the trash.", timestamp: "00:21:50,000 → 00:21:59,000" },
  { speaker: "B", text: "So they tried to adapt, but as I said, we need much more studies to understand the impact.", timestamp: "00:21:59,000 → 00:22:05,000" },
  { speaker: "B", text: "We did one study, by the way, with an intern here, Reena Saeed, who looked at the book, old book by Tristram, who described birds in Palestine and compared what Tristram observed in 1865 with what we observe today in terms of birds and bird migrations and so forth.", timestamp: "00:22:05,000 → 00:22:08,000" },
  { speaker: "B", text: "And obviously there was dramatic loss of bird fauna in Palestine in the last 150 years or so, whether that's due to climate change, human destruction of habitats or other things, or diversions of water and so on.", timestamp: "00:22:08,000 → 00:22:22,000" },
  { speaker: "B", text: "We don't know the exact components of this. Probably all of the above impacted this loss, but we do know that there's a loss of migration and migratory routes and also a loss of some species like the fishing owl, where you mentioned there was an owl species called the fishing owl, literally lived off of eating the fish from the Zarqa River.", timestamp: "00:22:22,000 → 00:22:29,000" },
  { speaker: "B", text: "And this one's extinct, it's no longer found. Why did it go extinct? I'm sure it has to do with human activities, but which human activities? Building dams around the river, restricting flows, over-extraction of flows, a drop in rainfall, a combination of all the above is the most likely answer.", timestamp: "00:22:29,000 → 00:22:35,000" },
  { speaker: "A", text: "Thank you for clarifying that because I only visited for a few days, but I thought it was quite strange what I saw with the fish farming, the whole land's been transformed.", timestamp: "00:22:35,000 → 00:22:44,000" },
  { speaker: "B", text: "Yeah, the landscape here is, I mean, if you came back, if you went back in time 100 years ago, you would see a significant transformation of the land. This was a land that hasn't changed in thousands of years, literally, with human habitation, with human going from hunting gathering to agriculture and domestication of animals.", timestamp: "00:22:44,000 → 00:22:48,000" },
  { speaker: "B", text: "And pastoralism, 12,000 years ago, the landscape remained relatively stable. But in the last 150 years, it was completely transformed. And I call it scarred, you know, scarred landscape.", timestamp: "00:22:48,000 → 00:23:01,000" },
  { speaker: "B", text: "So we really need to rethink our policies as humans. And we the indigenous people try to tell the colonizers and anybody who would listen, you're not doing even yourself as a colonizer a favor by doing this.", timestamp: "00:23:10,000 → 00:23:14,000" },
  { speaker: "B", text: "Bombing Gaza, for example, and letting the Gaza people not have sewage treatment facilities that function and their sewage runs into the Mediterranean Sea that's scarring the sea, not just scarring the land.", timestamp: "00:23:14,000 → 00:23:22,000" },
  { speaker: "B", text: "And the sewage of Gaza flows north because of the currents from the Suez Canal. And so literally the Israelis are swimming in the shit of Gaza and Jaffa and Tel Aviv because our government thinks short term destruction of the people of Gaza instead of thinking long term habitation and health of the Mediterranean Sea.", timestamp: "00:23:22,000 → 00:23:38,000" },
  { speaker: "B", text: "Health of the Mediterranean or health of the environment, health of the air, health of the land. They don't think that way. They destroyed millions of trees, for example.", timestamp: "00:23:38,000 → 00:23:49,000" },
  { speaker: "A", text: "Like fast engineering, you only care about fast engineering.", timestamp: "00:23:49,000 → 00:23:55,000" },
  { speaker: "B", text: "And then they planted only pine trees for many decades. That's a tree they planted.", timestamp: "00:23:55,000 → 00:24:01,000" },
  { speaker: "B", text: "The tree that doesn't even survive here, the wood is different.", timestamp: "00:24:01,000 → 00:24:07,000" },
  { speaker: "A", text: "I want to go back to the sky a little bit because you talked about the air.", timestamp: "00:24:22,000 → 00:24:28,000" },
  { speaker: "A", text: "I'm trying to look at what is the sort of air that becomes restricted and also as the last remaining space of ecological continuity because there's restricted zones in the sky, but for birds, they can still fly through those restricted zones.", timestamp: "00:24:28,000 → 00:24:38,000" },
  { speaker: "A", text: "Because you work a lot of biodiversity and you talked about the air and also how the rain is polluting the ground.", timestamp: "00:24:38,000 → 00:24:47,000" },
  { speaker: "A", text: "What is your perception of air because it's the air you breathe and it's also a sense that you experience every day?", timestamp: "00:24:47,000 → 00:24:55,000" },
  { speaker: "B", text: "Well, as you said, air is a continuous material that when Israel builds walls, apartheid segregation walls to isolate Palestinians from their land and from each other, that impacts a lot.", timestamp: "00:24:55,000 → 00:25:02,000" },
  { speaker: "B", text: "It impacts humans. It impacts nature. It impacts water flows.", timestamp: "00:25:02,000 → 00:25:06,000" },
  { speaker: "B", text: "For example, it impacts biodiversity because land mammals, of course, cannot cross walls, large mammals, etc.", timestamp: "00:25:06,000 → 00:25:13,000" },
  { speaker: "B", text: "This all is impacted by walls and fences and so on.", timestamp: "00:25:14,000 → 00:25:20,000" },
  { speaker: "B", text: "But also you cannot think of birds as somehow immune from this thing.", timestamp: "00:25:20,000 → 00:25:26,000" },
  { speaker: "B", text: "I mean, if you look at the satellite image around Gaza and the difference between Gaza today, Gaza Strip and what surrounds it, Gaza is, of course, devastated, environmentally catastrophic.", timestamp: "00:25:26,000 → 00:25:30,000" },
  { speaker: "B", text: "We looked at this using remote sensing, for example, destruction of greenhouses, destruction of tree covers, destruction of natural habitats.", timestamp: "00:25:30,000 → 00:25:38,000" },
  { speaker: "B", text: "It's devastated. This impacts the air of Gaza, of course, because air is produced by this biotic interaction, not just the physical component of air.", timestamp: "00:25:38,000 → 00:25:52,000" },
  { speaker: "B", text: "So if you destroy the Amazon, certainly the air globally will be impacted, not just locally in the Amazon.", timestamp: "00:25:52,000 → 00:26:02,000" },
  { speaker: "B", text: "So if you look at the satellite image of Gaza, what is this wall going to do? Is it going to isolate the air of Gaza away from the air of Tel Aviv and Jaffa?", timestamp: "00:26:02,000 → 00:26:09,000" },
  { speaker: "B", text: "No, it is all a continuous matrix that is going to be impacted.", timestamp: "00:26:09,000 → 00:26:13,000" },
  { speaker: "B", text: "Pollution in Gaza is going to reach everywhere, including the Americas, not just there.", timestamp: "00:26:13,000 → 00:26:20,000" },
  { speaker: "B", text: "So that is why air component is a significant component of these things and people have to understand the connectivity.", timestamp: "00:26:20,000 → 00:26:28,000" },
  { speaker: "B", text: "I go back to this notion that we indigenous people have that there's mother earth, there's living earth, and biology has proven this.", timestamp: "00:26:28,000 → 00:26:31,000" },
  { speaker: "B", text: "Even though the indigenous wisdom existed for thousands of years, only now biologists, have you heard, for example, the butterfly effect?", timestamp: "00:26:31,000 → 00:26:41,000" },
  { speaker: "B", text: "Some butterfly in Amazon maybe flapping its wings could cause a hurricane somewhere else, because everything is connected.", timestamp: "00:26:41,000 → 00:26:47,000" },
  { speaker: "B", text: "Everything is tied together. Earth is this one breathing new planet that is not separated by these artificial human borders that were created.", timestamp: "00:26:47,000 → 00:26:58,000" },
  { speaker: "B", text: "That's a separate issue which one day I want to write a paper on maybe with Emil or somebody about the borders we have.", timestamp: "00:26:58,000 → 00:27:03,000" },
  { speaker: "B", text: "Borders are not just the physical borders and checkpoints and going in and out of countries.", timestamp: "00:27:03,000 → 00:27:13,000" },
  { speaker: "B", text: "There's also the mental borders that people create in their own mind about what is it that we as humans, am I connected to people living, let's say, in Hong Kong?", timestamp: "00:27:13,000 → 00:27:22,000" },
  { speaker: "B", text: "Of course I am. We are part of this tiny planet.", timestamp: "00:27:22,000 → 00:27:30,000" },
  { speaker: "B", text: "When you think of its size relative to just our own galaxy, for example, it's nothing. It's spec, but it's all connected.", timestamp: "00:27:30,000 → 00:27:41,000" },
  { speaker: "B", text: "And if we don't pay attention, we're destroying this planet.", timestamp: "00:27:41,000 → 00:27:44,000" },
  { speaker: "A", text: "And also in your papers on militarization, because now thinking about the scarred landscape, the scarred air, the scarred organisms that we're living in.", timestamp: "00:27:44,000 → 00:27:50,000" },
  { speaker: "A", text: "I mean, you often describe the landscape as shaped by militarization, walls, firing zones, settlements, military bases.", timestamp: "00:27:50,000 → 00:27:57,000" },
  { speaker: "A", text: "And you already spoke a little bit about the infrastructure's functions as ecological forces, because you speak a lot about walls and borders.", timestamp: "00:27:57,000 → 00:28:01,000" },
  { speaker: "A", text: "But this is also militarization as well. This ideology of militarization is using walls.", timestamp: "00:28:01,000 → 00:28:07,000" },
  { speaker: "A", text: "So I guess I'm trying to understand about looking at ecological forces like our body proximities, for example, our human organisms, our vibrations with the connection with land and air.", timestamp: "00:28:07,000 → 00:28:17,000" },
  { speaker: "A", text: "How is the militarization deepening the scars?", timestamp: "00:28:17,000 → 00:28:20,000" },
  { speaker: "B", text: "Yeah, this is a very important question. The way the world is now has moved.", timestamp: "00:28:20,000 → 00:28:28,000" },
  { speaker: "B", text: "Since really the Industrial Revolution and the European colonizations, even before that, European colonizations of the developing world, as they call it, or the Third World, sometimes they call us derogatively, the Global South, if you want.", timestamp: "00:28:28,000 → 00:28:38,000" },
  { speaker: "B", text: "And the idea of the world and the direction has always been a competition between two groups of individuals, two collections.", timestamp: "00:28:38,000 → 00:28:47,000" },
  { speaker: "B", text: "There's a group of individuals that's a tiny minority that thinks of profit and money and resources as commodities to be used for their own purposes, not caring about other people or other environments, whatever.", timestamp: "00:28:47,000 → 00:28:56,000" },
  { speaker: "B", text: "This selfishness of this clique of people and the other group of people, indigenous people and others, want to preserve Earth long term and have sustainability.", timestamp: "00:28:56,000 → 00:29:02,000" },
  { speaker: "B", text: "Sustainability is an important word, and I don't think necessarily of sustainable development, because to me, a tribe in the Amazon doesn't need to develop.", timestamp: "00:29:02,000 → 00:29:11,000" },
  { speaker: "B", text: "It's living happily in nature, environment, collaboration with nature long term.", timestamp: "00:29:11,000 → 00:29:19,000" },
  { speaker: "B", text: "Sit down if you want to listen.", timestamp: "00:29:19,000 → 00:29:21,000" },
  { speaker: "B", text: "So it's an important component to have sustainability.", timestamp: "00:29:21,000 → 00:29:30,000" },
  { speaker: "B", text: "The struggle between those two groups has been going on for a long time, but it is now accelerating.", timestamp: "00:29:30,000 → 00:29:38,000" },
  { speaker: "B", text: "And the amount of destruction that humans are capable of inflicting on nature and fellow human beings has expanded dramatically in the last few decades with nuclear weapons, for example, with technology that allows us to produce more greenhouse gases, et cetera.", timestamp: "00:29:38,000 → 00:29:45,000" },
  { speaker: "B", text: "I mean, AI alone, think of how much energy is going to be consumed by AI and so forth.", timestamp: "00:29:45,000 → 00:29:51,000" },
  { speaker: "B", text: "This adds the stress rare minerals now people are fighting for.", timestamp: "00:29:51,000 → 00:30:02,000" },
  { speaker: "B", text: "So the group that is the tiny group, the less than 1% of the population who wants to just profit and increase the riches and so forth, they are working overtime to basically destroy and plan how to destroy and plan how to subjugate the other 99%.", timestamp: "00:30:02,000 → 00:30:07,000" },
  { speaker: "B", text: "That's where you see militarization comes in, militarization of police in the US, for example, with ICE agents that just killed a woman, 37-year-old mother in Minneapolis.", timestamp: "00:30:07,000 → 00:30:16,000" },
  { speaker: "B", text: "This is what they are doing.", timestamp: "00:30:16,000 → 00:30:22,000" },
  { speaker: "B", text: "And Israel is a big component of this because it trains American police and so forth and militarizing police and things like that.", timestamp: "00:30:22,000 → 00:30:28,000" },
  { speaker: "B", text: "These people are connected to each other who want to oppress and destroy and exclude and keep people busy hating others, for example, hating Muslims, Islamophobia, hating immigrants, hating this, hating that.", timestamp: "00:30:28,000 → 00:30:38,000" },
  { speaker: "B", text: "Why? They want you to stay busy in a divisive world where you are pitted, all the masses are pitted against each other instead of thinking about their future and their long-term sustainability.", timestamp: "00:30:38,000 → 00:30:43,000" },
  { speaker: "B", text: "That's what they want to do.", timestamp: "00:30:43,000 → 00:30:47,000" },
  { speaker: "B", text: "So I think it's critical that we understand the connection of militarization and why Donald Trump now wants to increase the military budget from $1 trillion to $1.5 trillion.", timestamp: "00:30:47,000 → 00:30:52,000" },
  { speaker: "B", text: "And he says, we can afford it. What's we can afford? You can afford it.", timestamp: "00:30:52,000 → 00:30:58,000" },
  { speaker: "B", text: "The people of America now, they have $38 trillion in debt if you divide it by the population.", timestamp: "00:30:58,000 → 00:31:02,000" },
  { speaker: "B", text: "And I am a US citizen, by the way. I have debt that I have to pay.", timestamp: "00:31:02,000 → 00:31:08,000" },
  { speaker: "B", text: "You divide among the population $50,000 or $100,000 in debt before the government because the government takes the taxes, spends them, but they don't have enough to spend on all the military and all this stuff.", timestamp: "00:31:08,000 → 00:31:12,000" },
  { speaker: "B", text: "And the military is the largest expense a US does.", timestamp: "00:31:12,000 → 00:31:19,000" },
  { speaker: "B", text: "So this is all connected and understanding the world like this.", timestamp: "00:31:19,000 → 00:31:25,000" },
  { speaker: "B", text: "I mean, I'm in my resolution for 2026 actually is to write more paper explaining these connecting the dots.", timestamp: "00:31:25,000 → 00:31:30,000" },
  { speaker: "B", text: "My last email was about connecting the dots about Venezuela. Why Venezuela? Why are people attacking?", timestamp: "00:31:30,000 → 00:31:36,000" },
  { speaker: "B", text: "It's not just oil, by the way. It has to do with Israel. It has to do with rare minerals.", timestamp: "00:31:36,000 → 00:31:40,000" },
  { speaker: "B", text: "It has to do with this militarization and this keeping us busy thinking about the Venezuelan people sending drugs to America.", timestamp: "00:31:40,000 → 00:31:46,000" },
  { speaker: "B", text: "Let's fight that. You know, keeping people busy so that they keep pillaging, pillaging other people and pillaging the earth and destroying the earth.", timestamp: "00:31:46,000 → 00:31:49,000" },
  { speaker: "A", text: "Because you have worked with different organizations, even with like someone such as Yoshi Lesham who was in charge of the Aero networks in the past.", timestamp: "00:31:57,000 → 00:32:04,000" },
  { speaker: "A", text: "And now you're a bit more resilient about how you are spreading your knowledge and who you're sharing it with.", timestamp: "00:32:04,000 → 00:32:12,000" },
  { speaker: "A", text: "I want to understand the complexities of this because obviously as a Palestinian, he wants to bring the resistance back to the land and the justice.", timestamp: "00:32:12,000 → 00:32:17,000" },
  { speaker: "A", text: "I want to understand what it is that the complexities are involved in this.", timestamp: "00:32:17,000 → 00:32:20,000" },
  { speaker: "A", text: "As in like your collaborations with sort of looking after ecological biodiversity because you're in occupied Palestine.", timestamp: "00:32:28,000 → 00:32:32,000" },
  { speaker: "B", text: "I mean, I think by accident of birth, I was born in Palestine and I consider that to be a lucky accident of birth for me because Palestine is like the canary in the mine.", timestamp: "00:32:32,000 → 00:32:40,000" },
  { speaker: "B", text: "You know, it exposes all of these issues that we were talking about earlier.", timestamp: "00:32:40,000 → 00:32:48,000" },
  { speaker: "B", text: "It's a Achilles heel of Western hypocrisy and the Achilles heel of rampant capitalism that's gone unchecked for many decades, pillaging the world in the name of Western so-called democracies.", timestamp: "00:32:48,000 → 00:32:56,000" },
  { speaker: "B", text: "There's no democracies, by the way, in the West because it's money, the interests that determine whether it's this guy becomes president or that guy becomes president or and so on.", timestamp: "00:32:56,000 → 00:33:02,000" },
  { speaker: "B", text: "It's money, the interests in the West, whether it's in Britain or France or the U.S.", timestamp: "00:33:02,000 → 00:33:11,000" },
  { speaker: "B", text: "That's what we call Western democracy.", timestamp: "00:33:11,000 → 00:33:19,000" },
  { speaker: "B", text: "And it's a democracy if it is democracy for white elites, it's to pillage the rest of the world and keep sucking up the indigenous water, land, resources, you know, rare minerals, oil.", timestamp: "00:33:19,000 → 00:33:25,000" },
  { speaker: "B", text: "This is what it is about.", timestamp: "00:33:25,000 → 00:33:29,000" },
  { speaker: "B", text: "So, as I said, what is our role? Our role as indigenous peoples to work together.", timestamp: "00:33:29,000 → 00:33:34,000" },
  { speaker: "B", text: "But why Palestine is important?", timestamp: "00:33:34,000 → 00:33:38,000" },
  { speaker: "B", text: "Palestine exposes hypocrisy more than anywhere else, especially with the genocide and ecocide and scholasticity and medicite that has gone on for now over several decades, but accelerated in the past 26 months in the Gaza Strip.", timestamp: "00:33:38,000 → 00:33:45,000" },
  { speaker: "B", text: "A destruction of our health care, a destruction of our nature, etc.", timestamp: "00:33:45,000 → 00:33:49,000" },
  { speaker: "B", text: "This exposes Western hypocrisy and it plays a heavy burden on my shoulders and the shoulders of all Palestinians to speak out and to educate and to do institutions like this institution.", timestamp: "00:33:49,000 → 00:33:57,000" },
  { speaker: "B", text: "We plan, by the way, if they allow us to replicate this institution in the Gaza Strip, if they allow rebuilding in Gaza.", timestamp: "00:33:57,000 → 00:34:05,000" },
  { speaker: "B", text: "So that's where it places the burden on us.", timestamp: "00:34:05,000 → 00:34:11,000" },
  { speaker: "B", text: "But the burden on us is leading this because we are at the front line of the struggle.", timestamp: "00:34:11,000 → 00:34:17,000" },
  { speaker: "B", text: "But as I said, it's not a struggle for the Palestinians.", timestamp: "00:34:17,000 → 00:34:21,000" },
  { speaker: "B", text: "It's a struggle for the global 99.8% of the world that's not profiting from this.", timestamp: "00:34:21,000 → 00:34:28,000" },
  { speaker: "B", text: "People are losing jobs.", timestamp: "00:34:28,000 → 00:34:30,000" },
  { speaker: "B", text: "Young people don't have jobs around the world, whether it's in the US, China or Japan or anywhere else.", timestamp: "00:34:30,000 → 00:34:34,000" },
  { speaker: "B", text: "Because the corporations have been spending all the past few decades thinking of how best to reduce the workforce, not increase the workforce.", timestamp: "00:34:34,000 → 00:34:38,000" },
  { speaker: "B", text: "Because for them, people working for corporations reduces your profits.", timestamp: "00:34:38,000 → 00:34:42,000" },
  { speaker: "B", text: "So you want less workers.", timestamp: "00:34:42,000 → 00:34:45,000" },
  { speaker: "B", text: "You want automation.", timestamp: "00:34:45,000 → 00:34:48,000" },
  { speaker: "B", text: "You want more money going to the billionaires.", timestamp: "00:34:48,000 → 00:34:50,000" },
  { speaker: "B", text: "And Elon Musk will be the first human trillionaire.", timestamp: "00:34:50,000 → 00:34:54,000" },
  { speaker: "B", text: "Imagine not just a billionaire.", timestamp: "00:34:54,000 → 00:34:58,000" },
  { speaker: "B", text: "He already has $350 billion or $400 billion.", timestamp: "00:34:58,000 → 00:35:01,000" },
  { speaker: "B", text: "But he's slated to become the first human trillionaire.", timestamp: "00:35:01,000 → 00:35:06,000" },
  { speaker: "B", text: "That means $1,000 billion.", timestamp: "00:35:06,000 → 00:35:10,000" },
  { speaker: "B", text: "Which is enough, of course, to make every human being on Earth live comfortably at the survival level.", timestamp: "00:35:10,000 → 00:35:14,000" },
  { speaker: "A", text: "I guess also like with your collaborations, you're also trying to withstand normalization.", timestamp: "00:35:14,000 → 00:35:20,000" },
  { speaker: "A", text: "You don't want a normalization, a globalization of militarization or being restricted from your land as well.", timestamp: "00:35:20,000 → 00:35:26,000" },
  { speaker: "B", text: "Yeah, I mean, the reason they hate us most of all is because we show this hypocrisy.", timestamp: "00:35:26,000 → 00:35:32,000" },
  { speaker: "B", text: "Because we show that you cannot normalize with people who are destroying our planet.", timestamp: "00:35:32,000 → 00:35:37,000" },
  { speaker: "B", text: "You cannot normalize with people who are destroying the planet.", timestamp: "00:35:37,000 → 00:35:42,000" },
  { speaker: "B", text: "You have to defeat them. You have to defeat them.", timestamp: "00:35:42,000 → 00:35:46,000" },
  { speaker: "B", text: "And I'm not talking about defeating them militarily or by fighting, but we have to defeat them because we're the majority.", timestamp: "00:35:46,000 → 00:35:51,000" },
  { speaker: "B", text: "We're the biggest part of the population.", timestamp: "00:35:51,000 → 00:35:54,000" },
  { speaker: "B", text: "And if we all put our hands together and we remove the brainwashing, you know, that they do to us through these tasks we talked about earlier, divide and conquer kind of thing, making us worry about religions or about this or that.", timestamp: "00:35:54,000 → 00:35:58,000" },
  { speaker: "B", text: "And instead of worrying about whether there will be humans living on Earth in a few years or it will be infested by cockroaches because they are resistant to nuclear radiation.", timestamp: "00:35:58,000 → 00:36:03,000" },
  { speaker: "B", text: "That is what they want us to stay busy with.", timestamp: "00:36:03,000 → 00:36:08,000" },
];

export default function InterviewsPage() {
  const [theme, setTheme] = useState("dark");
  const [showTimestamps, setShowTimestamps] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <h2 className="no-underline">Interviews</h2>
        <p>Conversations with activists, biologists and ornithologists in Palestine.</p>

        <div className="interview-list">
          {/* Interview 1: anonymized participant B */}
          <div className="interview-card">
            <div className="interview-header">
              <h3>Interviewee: B</h3>
              <p className="interview-meta">Founder and director of a biodiversity and sustainability institute</p>
              <p className="interview-date">Recorded in Bethlehem, 2026</p>
              <button 
                className="timestamp-toggle"
                onClick={() => setShowTimestamps(!showTimestamps)}
              >
                {showTimestamps ? "Hide timestamps" : "Show timestamps"}
              </button>
            </div>
            <div className="transcript">
              {transcript.map((entry, idx) => (
                <div key={idx} className={`transcript-line ${entry.speaker === "B" ? "b" : "a"}`}>
                  <div className="speaker-name">{entry.speaker}</div>
                  {showTimestamps && <div className="timestamp">{entry.timestamp}</div>}
                  <div className="speaker-text">{entry.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .interview-list {
          margin-top: 2rem;
        }
        .interview-card {
          border: 1px solid #9afc97;
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .interview-header h3 {
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
        }
        .interview-meta {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.25rem;
        }
        .interview-date {
          font-size: 0.75rem;
          font-family: monospace;
          margin-bottom: 1rem;
        }
        .timestamp-toggle {
          background: transparent;
          border: 1px solid #9afc97;
          border-radius: 20px;
          padding: 0.2rem 0.8rem;
          font-size: 0.7rem;
          font-family: monospace;
          cursor: pointer;
          color: inherit;
          margin-bottom: 1rem;
        }
        .transcript {
          margin-top: 1rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .transcript-line {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(154, 252, 151, 0.2);
        }
        .speaker-name {
          font-weight: bold;
          font-size: 0.8rem;
          font-family: monospace;
          margin-bottom: 0.2rem;
        }
        .transcript-line.a .speaker-name {
          color: #9afc97;
        }
        .transcript-line.b .speaker-name {
          color: #ffaa44;
        }
        .timestamp {
          font-size: 0.7rem;
          font-family: monospace;
          opacity: 0.6;
          margin-bottom: 0.2rem;
        }
        .speaker-text {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        body.light-bg .interview-card {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        body.light-bg .interview-meta,
        body.light-bg .speaker-text {
          color: #000;
        }
        body.light-bg .timestamp-toggle {
          border-color: #2c6e2c;
          color: #2c6e2c;
        }
        @media (max-width: 768px) {
          .speaker-text {
            font-size: 0.75rem;
          }
          .transcript {
            max-height: 60vh;
          }
        }
      `}</style>
    </div>
  );
}