"use client";
import { Button, TextField } from "@radix-ui/themes";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NewIssuePage = () => {
   return (
      <div className="max-w-xl space-y-4">
         <TextField.Root placeholder="title"></TextField.Root>
         <SimpleMdeReact placeholder="description"></SimpleMdeReact>
         <Button>Submit new Issue</Button>
      </div>
   );
};

export default NewIssuePage;
