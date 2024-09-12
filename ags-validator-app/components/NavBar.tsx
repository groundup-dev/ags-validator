// import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
// import {  LogOut } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
// //   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export function UserNavbar() {
//   const { user, isLoading } = useKindeBrowserClient();

//   if (isLoading) {
//     return null;
//   }

  return (
    <h1 className="p-3 h-10">GroundUp Ags Validator</h1>
    // <DropdownMenu>
    //   <TooltipProvider disableHoverableContent>
    //     <Tooltip delayDuration={100}>
    //       <TooltipTrigger asChild>
    //          <DropdownMenuTrigger asChild>
    //           <Button
    //             variant="outline"
    //             className="relative h-8 w-8 rounded-full"
    //           >
    //             <Avatar className="h-8 w-8">
    //               {user?.picture ? (
    //                 <AvatarImage src={user?.picture} alt="Avatar" />
    //               ) : (
    //                 <AvatarFallback className="bg-transparent">
    //                   {user?.given_name?.charAt(0)}
    //                 </AvatarFallback>
    //               )}
    //             </Avatar>
    //           </Button>
    //         </DropdownMenuTrigger>
    //       </TooltipTrigger>
    //       <TooltipContent side="bottom">Profile</TooltipContent>
    //     </Tooltip>
    //   </TooltipProvider>

    //    <DropdownMenuContent className="w-56" align="end" forceMount>
    //  <DropdownMenuLabel className="font-normal">
    //        <div className="flex flex-col space-y-1">
    //          <p className="text-sm font-medium leading-none">
    //            {user?.given_name} {user?.family_name}
    //          </p>
    //          <p className="text-xs leading-none text-muted-foreground">
    //            {user?.email}
    //          </p>
    //        </div>
    //      </DropdownMenuLabel>
    //      <DropdownMenuSeparator />

    // {  <LogoutLink>
    //        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
    //          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
    //          Sign out
    //        </DropdownMenuItem>
    //      </LogoutLink> */}
    //    </DropdownMenuContent>
    //  </DropdownMenu>
  );
}
