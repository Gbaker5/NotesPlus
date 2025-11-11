const { GoogleGenAI } = require("@google/genai");
const PromptResult = require("../models/PromptResults")
const User = require("../models/User")
const Notes = require("../models/Note")


module.exports = {
    getIndex: (req,res)=>{
        res.render('index.ejs',{messages: req.flash("error")})
    },

    getProfile: async (req,res) => {

        const thisUser = await User.find({_id: req.user._id})
        //console.log(thisUser)

        const myNotes = await Notes.find({author: req.user._id}).sort({createdAt:"asc"}) 
        //console.log(myNotes)
        //console.log(req.user._id)
       
        const Prompts = await PromptResult.find({author: req.user._id}).sort({createdAt: "asc"})
        //console.log(Prompts)


        res.render('profile.ejs', 
            {
            user:thisUser,
            notes: myNotes,
            gemini: Prompts,
            messages: req.flash("error") ,
        })
    },

    postNote: async(req,res) => {
        try{

            await Notes.create({
                note: req.body.noteText,
                author: req.user.id,
            })

            res.redirect('/profile')

        }catch (err){
        console.log(err)
     }


    },

    postPrompt: async (req,res) =>{

        console.log(req.body.geminiPrompt)
        
        const prompt = req.body.geminiPrompt

     try{
       
        const ai = new GoogleGenAI({apikey: process.env.GOOGLE_API_KEY});

        async function main() {
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `I want the result of this prompt to be a paragraph to rwo at the most. Unless specified otherwise. If asking for directions on something. List in bullet points with clear detail. with the leat amount of steps possible. Here is prompt: ${prompt}`
        });


        //console.log(response.candidates[0].content.parts[0].text)
        const promptResponse = response.candidates[0].content.parts[0].text

        // Extract just the text
        //const generatedText = response.candidates[0].content.parts
        //.map(p => p.text)
        //.join("");


        PromptResult.create({
        
        prompt: req.body.geminiPrompt,
        result: promptResponse,
        author: req.user.id,
        })
        }

        await main();

       
        res.redirect('/profile')
        

     } catch (err){
        console.log(err)
     }


    }
}