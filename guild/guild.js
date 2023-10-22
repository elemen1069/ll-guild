import { all } from "./plugins/lang.js";

var language = 1; // 0 : english , 1 : korean 

if (language == 1) {
    var l = all.korean;
}
else if (language == 0) {
    var l = all.english;
}










logger.info(`
░██████╗░██╗░░░██╗██╗██╗░░░░░██████╗░  ██████╗░██╗░░░░░██╗░░░██╗░██████╗░██╗███╗░░██╗
██╔════╝░██║░░░██║██║██║░░░░░██╔══██╗  ██╔══██╗██║░░░░░██║░░░██║██╔════╝░██║████╗░██║
██║░░██╗░██║░░░██║██║██║░░░░░██║░░██║  ██████╔╝██║░░░░░██║░░░██║██║░░██╗░██║██╔██╗██║
██║░░╚██╗██║░░░██║██║██║░░░░░██║░░██║  ██╔═══╝░██║░░░░░██║░░░██║██║░░╚██╗██║██║╚████║
╚██████╔╝╚██████╔╝██║███████╗██████╔╝  ██║░░░░░███████╗╚██████╔╝╚██████╔╝██║██║░╚███║
░╚═════╝░░╚═════╝░╚═╝╚══════╝╚═════╝░  ╚═╝░░░░░╚══════╝░╚═════╝░░╚═════╝░╚═╝╚═╝░░╚══╝
`)







function checkguild(guild) {
    const result = {
        "master": guild.master || l.none,
        "submaster": guild.submaster.length > 0 ? guild.submaster : l.none,
        "member": guild.member.length > 0 ? guild.member : l.none,
        "descript": guild.descript || l.none,
        "wait": guild.wait.length > 0 ? guild.wait : l.none
    };

    return result;
}

function getrank(guildData, playerName) {
    for (const key in guildData) {
        const guild = guildData[key];
        if (guild.master === playerName) {
            return 1; 
        } else if (guild.submaster.includes(playerName)) {
            return 2; 
        } else if (guild.member.includes(playerName)) {
            return 3; 
        }
    }
    return 0;
}

function playername(obj, playerName) {
    for (var key in obj) {
        if (
            obj[key]["master"] === playerName ||
            obj[key]["submaster"].includes(playerName) ||
            obj[key]["member"].includes(playerName) ||
            obj[key]["wait"].includes(playerName)
        ) {
            return key;
        }
    }
    return null;
}

function checkPlayer(guildData, playerName) {
    for (const key in guildData) {
        if (Object.hasOwnProperty.call(guildData, key)) {
            const guild = guildData[key];
            
            const wait = [guild.master].concat(guild.member, guild.submaster)
            if (wait.includes(playerName)) {
                return 1;
            }
        }
    }
    
    return 0; 
}

function checkPlayerkey(guildData, playerName) {
    for (const key in guildData) {
        if (Object.hasOwnProperty.call(guildData, key)) {
            const guild = guildData[key];
            
            const wait = [guild.master].concat(guild.member, guild.submaster)
            if (wait.includes(playerName)) {
                return key;
            }
        }
    }
    
    return false; 
}

function findkey(obj, keyToFind) {
    for (var key in obj) {
        if (key === keyToFind) {
            return obj[key];
        }
    }
    return null;
}

function make(player) {
    var ui = mc.newCustomForm();
    ui.setTitle(l.guildmake);
    ui.addInput(l.guildname, l.guildnamedescript);
    ui.addInput(l.guilddescript, l.guilddescriptdescript);
    player.sendForm(ui, (player, res) => {
        if (res !== null) {
        var file = File.readFrom("./plugins/db/guild.json");
        if (Object.keys(JSON.parse(file)).includes(res[0]) == false) {
                if (res[0].length <= 8) {
                    if (res[0] !== "") {
                        var json = new JsonConfigFile("./plugins/db/guild.json");
                        json.set(res[0], {"master": player.realName, "submaster": [], "member": [], "descript": res[1], "wait": []});
                        // fucking code !!! 
                        player.sendText(`[ ${res[0]} ] ${l.guildsummon}`);
                    }
                    else {
                        player.sendText(l.errorguildname)
                    }
                }
                else {
                    player.sendText(l.errorlongguildname);
                }
            }
        else {
            player.sendText(l.sameguildname);
        }
    }
    })
}

function list(player) {
    var guild = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var ui = mc.newSimpleForm();
    ui.setTitle(l.guildlist);
    var res = ""
    for (var key in guild) {
            res += `\n[ ${key} ] : ${guild[key].descript} : ${guild[key].master}`

    }
    ui.setContent(res)
    ui.addButton(l.listcheck)
    player.sendForm(ui, (player, id) => {});

}


function sguild(select, player) {
    var obj = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var get = findkey(obj, select);
    var ui = mc.newSimpleForm();
    ui.setTitle(select + l.guildjoin2);
    ui.setContent(`${l.master} : ${get.master}\n${l.descript} : ${get.descript}`);
    ui.addButton(l.joinguildbutton);
    player.sendForm(ui, (player,id) => {
        if (id !== null) {
            if (get.wait.includes(player.realName) == false) {
                get.wait.push(player.realName);
                new JsonConfigFile("./plugins/db/guild.json").set(select, get);
            }
            else if (get.wait.includes(player.realName) == true) {
                player.sendText(l.checksameguildjoin);
            }
        }
    })
}

function join(player) {
    var ui = mc.newSimpleForm();
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"))
    var key = Object.keys(json)
    ui.setTitle(l.guildjoin);
    key.forEach(k => {
        ui.addButton(`[ ${k} ]\n${l.joinbuttondescript}`);
    })
    if (key.length == 0) {
        ui.addButton(l.noneguild);
    }
    player.sendForm(ui, (player,id) => {
        if (id !== null) {
            sguild(key[id], player);    
        }
        
    })
}

function guild(player) {
    var ui = mc.newSimpleForm();
    ui.setTitle(l.guildmenu);
    ui.addButton(l.makeguildbutton);
    ui.addButton(l.guildlistbutton);
    ui.addButton(l.joinguildbutton);
    player.sendForm(ui,(player,id) => {
        switch (id) {
            case 0:
                make(player);
                break;
            case 1:
                list(player);
                break;
            case 2:
                join(player);
                break;
        }
    })
}

function playermanage(guild, player, select) {
    var ui = mc.newSimpleForm();
    ui.setTitle(select + l.joinmanage);
    ui.addButton(l.okjoin);
    ui.addButton(l.nojoin);
    player.sendForm(ui, (player,id) => {
        var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
        var my = json[guild];
        if (id == 0) {
            var wait = my.wait.filter(w => w !== select);
            my.wait = wait;
            my.member.push(select)
            new JsonConfigFile("./plugins/db/guild.json").set(guild, my);
            for (var key in json) {
                if (key !== guild) {
                    var reload = json[key].wait.filter(w => w !== select);
                    json[key].wait = reload
                    new JsonConfigFile("./plugins/db/guild.json").set(key, json[key]);
                }
            }
            player.sendText(l.okjoinmessage);
            mc.getPlayer(select).sendText(`[ ${guild} ] ${l.okjoinmessage}`)
        }
        else if (id == 1) {
            var wait = my.wait.filter(w => w !== select);
            my.wait = wait;
            new JsonConfigFile("./plugins/db/guild.json").set(guild, my);
            player.sendText(l.nojoinmessage);
            mc.getPlayer(select).sendText(`[ ${guild} ] ${l.nojoinmessage}`);
        }
    })
}

function joinmanage(player) {
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var my = playername(json, player.realName);
    var ui = mc.newSimpleForm();
    ui.setTitle(my + l.requestlist);
    json[my].wait.forEach(w => {
        ui.addButton(`[ ${w} ]\n${l.requestmanage}`);
    })
    if (json[my].wait.length == 0) {
        ui.addButton(l.nonerequestplayer);
    }
    player.sendForm(ui, (res, id) => {
        if (json[my].wait[id] !== undefined) {
            playermanage(my, player, json[my].wait[id]);
        }
    })
}


function deguild(player) {
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var my = playername(json, player.realName);
    var ui = mc.newSimpleForm()
    ui.setTitle(l.deleteguild);
    ui.setContent(`[ ${my} ]` + l.deletelastmessage);
    ui.addButton(l.deleteyes);
    ui.addButton(l.deleteno);
    player.sendForm(ui, (player, id) => {
        switch (id) {
            case 0 :
                new JsonConfigFile("./plugins/db/guild.json").delete(my);
                mc.getOnlinePlayers().forEach(pl => pl.sendText(`[ ${my} ] ${l.deletemessage}`));
                break;
            case 1 :
                player.sendText(l.canceldeletemessage);
                break;
        }
    })
}

function kickplayer(player, my, id) {
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var name = json[my].member[id]
    var ui = mc.newSimpleForm();
    ui.setTitle(name + l.selectmemberkick);
    ui.setContent(`[ ${name} ]` + l.kicklastmessage);
    ui.addButton(l.yeskick);
    ui.addButton(l.nokick);
    player.sendForm(ui, (player, id) => {
        switch (id) {
            case 0 :
                var res = json[my]
                var m = res.member.filter(p => p !== name);
                res.member =  m;
                new JsonConfigFile("./plugins/db/guild.json").set(my, res);
                player.sendText(name + l.kickmember)
                mc.getPlayer(name).sendText(my + l.kickedme);
                break;
            case 1 :
                player.sendText(name + l.cancelkick);
                break;
        }
    })
}

function kick(player) {
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var my = playername(json, player.realName);
    var ui = mc.newSimpleForm();
    ui.setTitle(l.memberkick);
    json[my].member.forEach(p => {
        ui.addButton(`[ ${p} ]\n${l.selectkick}`);
    })
    if (json[my].member.length == 0) {
        ui.addButton(l.noneguildmember);
    }
    player.sendForm(ui, (player, id) => {
        if (json[my].member.length !== 0) {
            if (id !== null) {
                kickplayer(player, my, id);
            }
        }
    })
}

function info(player) {
    var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var my = playername(json, player.realName);
    var guild = checkguild(json[my]);
    var txt = `[ ${my} ] ${l.guildinfo}\n${l.infomaster} : ${guild.master}\n\n${l.infosubmaster} : ${guild.submaster}\n\n${l.infomember} : ${guild.member}\n\n${l.infodescript} : ${guild.descript}\n\n${l.infojoinlist} : ${guild.wait}`;
    var ui = mc.newSimpleForm();
    ui.setTitle(my + l.guildinfo);
    ui.setContent(txt)
    ui.addButton(l.infocheck);
    player.sendForm(ui, (player, id) => {});
}

function hasguild(player) {
    var guild = JSON.parse(File.readFrom("./plugins/db/guild.json"));
    var ui = mc.newSimpleForm();
    ui.setTitle(l.guildmenu2);
    ui.addButton(l.menuinfo);
    ui.addButton(l.menukickmember);
    ui.addButton(l.menujoinmanage);
    ui.addButton(l.menudeleteguild);
    player.sendForm(ui,(player,id) => {
        // 마스터 1 부마스터 2 멤버 3
        switch (id) {
            case 0:
                info(player);
                break;
            case 1:
                if (getrank(guild, player.realName) < 3) {
                    kick(player);
                }
                else {
                    player.sendText("§c마스터 또는 부마스터만 사용 가능한 기능입니다!");
                }
                break;
            case 2:
                if (getrank(guild, player.realName) < 3) {
                    joinmanage(player);
                }
                else {
                    player.sendText("§c마스터 또는 부마스터만 사용 가능한 기능입니다!");
                }
                break;
            case 3:
                if (getrank(guild, player.realName) == 1) {
                    deguild(player);
                }
                else {
                    player.sendText("§c마스터만 사용 가능한 기능입니다!");
                }
                break;
        }
    })
}

var cmd = mc.newCommand(l.guildcommand, l.commanddescript, PermType.Any);
cmd.overload([]);
cmd.setCallback((cmd , origin) => {
    var file = File.readFrom("./plugins/db/guild.json");
    if (checkPlayer(JSON.parse(file), origin.player.realName) == 0) {
        guild(origin.player);
    }
    else {
        hasguild(origin.player);
    }
})
cmd.setup()


var chat = mc.newCommand(l.chatcommand, l.chatcommanddescript, PermType.Any);
chat.setEnum("kind", [l.all, l.guild]);
chat.mandatory("action", ParamType.Enum, "kind", 1);
chat.overload(["kind"]);
chat.setCallback((cmd, ori,out, res) => {
    var json = new JsonConfigFile("./plugins/db/chanal.json")
    switch (res.action) {
        case "전체":
            json.set(ori.player.realName, "전체");
            ori.player.sendText(l.allchatmessage);
            break;
        case "길드":
            json.set(ori.player.realName, "길드");
            ori.player.sendText(l.guildchatmessage);
            break;
        case "global":
            json.set(ori.player.realName, "전체");
            ori.player.sendText(l.allchatmessage);
            break;
        case "guild":
            json.set(ori.player.realName, "길드");
            ori.player.sendText(l.guildchatmessage);
            break;
    }
})
chat.setup()

mc.listen("onChat", (player, msg) => {
    var file = JSON.parse(File.readFrom("./plugins/db/chanal.json"));
    var json = new JsonConfigFile("./plugins/db/chanal.json");
    var guild = JSON.parse(File.readFrom("./plugins/db/guild.json"))
    if (Object.keys(file).includes(player.realName) == true) {
        if (json.get(player.realName) == l.guild) {
            if (checkPlayerkey(guild, player.realName) !== false) {
                var name = checkPlayerkey(guild, player.realName)
                var key = guild[name];
                var players = [key.master].concat(key.submaster, key.member);
                mc.getOnlinePlayers().forEach(p => {
                    if (players.includes(p.realName) == true) {
                        p.sendText(l.hasguildmark + player.realName + ": " + msg);
                    }
                })
                return false;
            }
            else if (checkPlayerkey(guild, player.realName) == false) {
                player.sendText(l.chaterrormessage);
                json.set(player.realName, "전체");
                return false;
            }
        }
        else if (json.get(player.realName) == l.all) {
            mc.getOnlinePlayers().forEach(p => p.sendText(l.allmark + player.realName + ": " + msg));
            return false;
        }
    }
    else if (Object.keys(file).includes(player.realName) == false) {
        mc.getOnlinePlayers().forEach(p => p.sendText(l.allmark + player.realName + ": " + msg));
        return false;
    }
})

function check(obj, valueToFind) {
    for (var key in obj) {
        if (
            obj[key]["submaster"].includes(valueToFind) ||
            obj[key]["master"] === valueToFind ||
            obj[key]["member"].includes(valueToFind)
        ) {
            return key;
        }
    }
    return null;
}

mc.listen("onAttackEntity", (player , entity) => {
        var json = JSON.parse(File.readFrom("./plugins/db/guild.json"));
        if (entity.type == "minecraft:player") {
            if (check(json, player.realName) == check(json, entity.name)) {
                if (check(json, player.realName) !== null) {
                    if (check(json, entity.name) !== null) {
                        player.sendText(l.notattack);
                        return false;
                    }
                }
            }
        }
})
