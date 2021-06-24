/*
 * siel.js
 *
 * Created on 23/02/2015
 *
 *
 * SIEL's windows presentation methods
 *
 * @version Revision 1.1.0
 * @since Build 1.0 (02 2015)
 * @author Pedro Montibeler
 */

var mainHtml;

function loadMain() {
	document.getElementById("content").innerHTML = mainHtml;
}

function loadRepTable() {
	var reptable = document.getElementById("rep-table");
	for (var i = 0; i < parsedFiles.length; i++) {
		var row = reptable.insertRow(i+1);
		var cell0 = row.insertCell(0);
		cell0.innerHTML = fileNames[i];
		var cell1 = row.insertCell(1);
		cell1.innerHTML = parsedFiles[i].length;
		var cell2 = row.insertCell(2);
		cell2.innerHTML = "<span onclick=\"editRep('"+fileNames[i]+"',"+i+")\" class=\"glyphicon glyphicon-edit btn btn-primary\" title=\"editar repertório\" style=\"color:#fff;\"></span>";
		var cell3 = row.insertCell(3);
		cell3.innerHTML = "<span onclick=\"delRep("+i+")\" class=\"glyphicon glyphicon-trash btn btn-danger\" title=\"remover repertório\" style=\"color:#fff;\"></span>";
		var cell4 = row.insertCell(4);
		cell4.innerHTML = "<span onclick=\"loadTasksLocal("+i+")\" class=\"glyphicon glyphicon-play btn btn-success\" title=\"executar repertório\" style=\"color:#fff;\"></span>";
		if (log[i]["dataSaved"] != null) {
			var cell5 = row.insertCell(5);
			cell5.innerHTML = "<span onclick=\"showLog('"+fileNames[i]+"',"+i+")\" class=\"glyphicon glyphicon-folder-open btn btn-primary\" title=\"exibir log\" style=\"color:#fff;\"></span>";
		}
	}
}

function editRep(nome, repN) {
	mainHtml = document.getElementById("content").innerHTML;
	var repHtml = "<div class=\"jumbotron\">";
	repHtml = repHtml.concat("<div class=\"header\">");
	repHtml = repHtml.concat("<div class=\"container\">");
	repHtml = repHtml.concat("<h3>Detalhes do repertório "+nome+"</h3>");
	repHtml = repHtml.concat("<ul class=\"nav nav-pills pull-right\">");
	repHtml = repHtml.concat("<li>");
	repHtml = repHtml.concat("<button type=\"button\" onclick=\"loadMain()\" class=\"btn btn-primary\" style=\"color: #fff;\">");
	repHtml = repHtml.concat("<span class=\"glyphicon glyphicon-arrow-left\"></span> Voltar");
	repHtml = repHtml.concat("</button>");
	repHtml = repHtml.concat("</li>");
	repHtml = repHtml.concat("<li>");
	repHtml = repHtml.concat("<button type=\"button\" onclick=\"execEdit("+repN+")\" class=\"btn btn-success\" style=\"color: #fff;\">");
	repHtml = repHtml.concat("<span class=\"glyphicon glyphicon-ok\"></span> Confirmar ações");
	repHtml = repHtml.concat("</button>");
	repHtml = repHtml.concat("</li>");
	repHtml = repHtml.concat("</ul>");
	repHtml = repHtml.concat("</div><!-- ./container -->");
	repHtml = repHtml.concat("</div><!-- ./header -->");
	repHtml = repHtml.concat("<br>");
	repHtml = repHtml.concat("Exibir progresso durante sessão:");
	if (progressIndex[repN]) {
		repHtml = repHtml.concat(" <input type=\"checkbox\" id=\"check-progress\" checked>");
	} else {
		repHtml = repHtml.concat(" <input type=\"checkbox\" id=\"check-progress\"checked>");
	}
	repHtml = repHtml.concat("<br>");
	repHtml = repHtml.concat("Permitir fechar durante sessão:");
	if (escIndex[repN]) {
		repHtml = repHtml.concat(" <input type=\"checkbox\" id=\"check-esc\" checked>");
	} else {
		repHtml = repHtml.concat(" <input type=\"checkbox\" id=\"check-esc\" checked>");
	}
	repHtml = repHtml.concat("<br>");
	repHtml = repHtml.concat("Letras das tarefas:");
	if (capsIndex[repN]) {
		repHtml = repHtml.concat(" <label class=\"radio-inline\"><input type=\"radio\" name=\"opt-letras\" checked>Maiúsculas</label>");
		repHtml = repHtml.concat(" <label class=\"radio-inline\"><input type=\"radio\" name=\"opt-letras\">Minúsculas</label>");
	} else {
		repHtml = repHtml.concat(" <label class=\"radio-inline\"><input type=\"radio\" name=\"opt-letras\">Maiúsculas</label>");
		repHtml = repHtml.concat(" <label class=\"radio-inline\"><input type=\"radio\" name=\"opt-letras\" checked>Minúsculas</label>");
	}
	repHtml = repHtml.concat("<br>");
	repHtml = repHtml.concat("<div class=\"table-responsive\">");
	repHtml = repHtml.concat("<table id=\"rep-detail\" class=\"table table-striped table-bordered table-hover table-condensed\">");
	repHtml = repHtml.concat("<tr><th rowspan=\"2\">N°</th><th rowspan=\"2\">Tipo de Tarefa</th><th rowspan=\"2\">Descrição</th><th colspan=\"2\">Exibir reforços para as Tarefas</th><th rowspan=\"2\">Modelo</th><th>Remover</th></tr>");
	repHtml = repHtml.concat("<tr>");
	repHtml = repHtml.concat("<td>Marcar todos: <input type=\"checkbox\" id=\"reforco-img-checkall\" onchange=\"checkSwitch('reforco-img')\"> <span class=\"glyphicon glyphicon-picture\" title=\"mostrar imagem\"></span></td>");
	repHtml = repHtml.concat("<td>Marcar todos: <input type=\"checkbox\" id=\"reforco-som-checkall\" onchange=\"checkSwitch('reforco-som')\"> <span class=\"glyphicon glyphicon-volume-up\" title=\"tocar som\"></span></td>");
	repHtml = repHtml.concat("<td>Marcar todos: <input type=\"checkbox\" id=\"remove-checkall\" onchange=\"checkSwitch('remove')\"></td>");
	repHtml = repHtml.concat("</tr>");
	repHtml = repHtml.concat("</table>");
	repHtml = repHtml.concat("</div><!-- ./table-responsive -->");
	repHtml = repHtml.concat("</div><!-- ./jumbotron -->");
	document.getElementById("content").innerHTML = repHtml;
	var table = document.getElementById("rep-detail");
	for (var i = 0; i < parsedFiles[repN].length; i++) {
		var row = table.insertRow(i+2);
		var cell0 = row.insertCell(0);
		cell0.innerHTML = i+1;
		var cell1 = row.insertCell(1);
		cell1.innerHTML = parsedFiles[repN][i]["Tipo de Tarefa"];
		var cell2 = row.insertCell(2);
		cell2.innerHTML = describe(parsedFiles[repN][i]["Tipo de Tarefa"]);
		var cell3 = row.insertCell(3);
		if (reforcoIndex[repN][i][0]) {
			cell3.innerHTML = "<input type=\"checkbox\" name=\"reforco-img\" value=\""+i+"\" checked> <span class=\"glyphicon glyphicon-picture\" title=\"mostrar imagem\"></span>";
		} else {
			cell3.innerHTML = "<input type=\"checkbox\" name=\"reforco-img\" value=\""+i+"\"> <span class=\"glyphicon glyphicon-picture\" title=\"mostrar imagem\"></span>";
		}
		var cell4 = row.insertCell(4);
		if (reforcoIndex[repN][i][1]) {
			cell4.innerHTML = "<input type=\"checkbox\" name=\"reforco-som\" value=\""+i+"\" checked> <span class=\"glyphicon glyphicon-volume-up\" title=\"tocar som\"></span>";
		} else {
			cell4.innerHTML = "<input type=\"checkbox\" name=\"reforco-som\" value=\""+i+"\"> <span class=\"glyphicon glyphicon-volume-up\" title=\"tocar som\"></span>";
		}
		var cell5 = row.insertCell(5);
		cell5.innerHTML = parsedFiles[repN][i]["Modelo"];
		var cell6 = row.insertCell(6);
		cell6.innerHTML = "<input type=\"checkbox\" name=\"remove\" value=\""+i+"\">";
	}
}

function checkSwitch(nome){
	var checkbox = document.getElementsByName(nome);
	var checkall = document.getElementById(nome+"-checkall");
	for (var i = 0; i < checkbox.length; i++) {
		checkbox[i].checked = checkall.checked;
	}
}

function execEdit(repN) {
	progressIndex[repN] = document.getElementById("check-progress").checked;
	escIndex[repN] = document.getElementById("check-esc").checked;
	capsIndex[repN] = document.getElementsByName("opt-letras")[0].checked;
	var rimg = document.getElementsByName("reforco-img");
	var rsom = document.getElementsByName("reforco-som");
	var rem = document.getElementsByName("remove");
	var tam = rimg.length;
	var nRem = 0;
	for (var i = 0; i < tam; i++) {
		reforcoIndex[repN][i-nRem][0] = rimg[i].checked;
		reforcoIndex[repN][i-nRem][1] = rsom[i].checked;
		if (rem[i].checked) {
			parsedFiles[repN].splice(i-nRem,1);
			reforcoIndex[repN].splice(i-nRem,1);
			nRem++;
		}
	}
	loadMain();
	document.getElementById("rep-table").rows[repN+1].cells[1].innerHTML = parsedFiles[repN].length;
}

function showLog(nome, repN) {
	mainHtml = document.getElementById("content").innerHTML;
	var logHtml = "<div class=\"jumbotron\">";
	logHtml = logHtml.concat("<div class=\"header\">");
	logHtml = logHtml.concat("<div class=\"container\">");
	logHtml = logHtml.concat("<h3>Log do repertório "+nome+"</h3>");
	logHtml = logHtml.concat("<ul class=\"nav nav-pills pull-right\">");
	logHtml = logHtml.concat("<li>");
	logHtml = logHtml.concat("<button type=\"button\" onclick=\"loadMain()\" class=\"btn btn-primary\" style=\"color: #fff;\">");
	logHtml = logHtml.concat("<span class=\"glyphicon glyphicon-arrow-left\"></span> Voltar");
	logHtml = logHtml.concat("</button>");
	logHtml = logHtml.concat("</li>");
	logHtml = logHtml.concat("<li>");
	logHtml = logHtml.concat("<button type=\"button\" onclick=\"download(computeLog("+repN+"),'log_"+log[repN]["timeStamp"]+"_"+nome+"', 'text/plain');\" class=\"btn btn-success\" style=\"color: #fff;\">");
	logHtml = logHtml.concat("<span class=\"glyphicon glyphicon-download-alt\"></span> Baixar log");
	logHtml = logHtml.concat("</button>");
	logHtml = logHtml.concat("</li>");
	logHtml = logHtml.concat("</ul>");
	logHtml = logHtml.concat("</div><!-- ./container -->");
	logHtml = logHtml.concat("</div><!-- ./header -->");
	logHtml = logHtml.concat("<br>");
	logHtml = logHtml.concat("<div class=\"table-responsive\">");
	logHtml = logHtml.concat("<table id=\"log-detail\" class=\"table table-striped table-bordered table-hover table-condensed\">");
	logHtml = logHtml.concat("<tr><th>Data/Hora/Min</th><th>N° da Tarefa</th><th>Tipo de Tarefa</th><th>Modelo</th><th>Comparações</th><th>Resposta</th><th>Tentativas</th><th>Latência da Tentativa (seg)</th><th>Latência da Tarefa (seg)</th><th>Resultado</th><th>Latência do Repertório (seg)</th><th>Acertos</th><th>Erros</th></tr>");
	logHtml = logHtml.concat("</table>");
	logHtml = logHtml.concat("</div><!-- ./table-responsive -->");
	logHtml = logHtml.concat("</div><!-- ./jumbotron -->");
	document.getElementById("content").innerHTML = logHtml;
	var table = document.getElementById("log-detail");
	var rN = 1;
	for (var i = 0; i < parsedFiles[repN].length; i++) {
		for (var j = 0; j < log[repN]["t"+i+".attempts"]; j++) {
			var row = table.insertRow(rN++);
			var cell0 = row.insertCell(0);
			if (i == 0 && j == 0) {
				cell0.innerHTML = log[repN]["timeStamp"];
			}
			var cell1 = row.insertCell(1);
			cell1.innerHTML = i+1;
			var cell2 = row.insertCell(2);
			cell2.innerHTML = parsedFiles[repN][i]["Tipo de Tarefa"];
			var cell3 = row.insertCell(3);
			cell3.innerHTML = parsedFiles[repN][i]["Modelo"];
			var cell4 = row.insertCell(4);
			cell4.innerHTML = getComps(repN, i);
			var cell5 = row.insertCell(5);
			cell5.innerHTML = log[repN]["t"+i+".a"+j+".response"];
			var cell6 = row.insertCell(6);
			cell6.innerHTML = j+1;
			var cell7 = row.insertCell(7);
			cell7.innerHTML = numToString(log[repN]["t"+i+".a"+j+".response_time"]);
			var cell8 = row.insertCell(8);
			if (j == log[repN]["t"+i+".attempts"]-1) {
				cell8.innerHTML = numToString(log[repN]["t"+i+".total_response_time"]);
			}
			var cell9 = row.insertCell(9);
			cell9.innerHTML = log[repN]["t"+i+".a"+j+".result"];
			var cell10 = row.insertCell(10);
			var cell11 = row.insertCell(11);
			var cell12 = row.insertCell(12);
			if (i == 0 && j == 0) {
				cell10.innerHTML = numToString(log[repN]["rep_response_time"]);
				cell11.innerHTML = log[repN]["pos_result_num"];
				cell12.innerHTML = log[repN]["neg_result_num"];
			}
		}
	}
}

function cleanRepTable() {
	var reptable = document.getElementById("rep-table");
	for (var i = 0; i < parsedFiles.length; i++) {
		reptable.deleteRow(1);
	}
}

function delRep(repN) {
	cleanRepTable();
	parsedFiles.splice(repN,1);
	fileNames.splice(repN,1);
	reforcoIndex.splice(repN,1);
	progressIndex.splice(repN,1);
	escIndex.splice(repN,1);
	capsIndex.splice(repN,1);
	log.splice(repN,1);
	rowN--;
	loadRepTable();
}

function describe(sigla) {
	var letras = sigla.split("");
	var resultado = "";
	if (letras[0] == "A") {
		resultado = resultado.concat("Áudio-");
	} else if (letras[0] == "B") {
		resultado = resultado.concat("Imagem-");
	} else if (letras[0] == "C") {
		resultado = resultado.concat("Texto-");
	}
	if (letras[1] == "B") {
		resultado = resultado.concat("Imagem");
	} else  if (letras[1] == "C") {
		resultado = resultado.concat("Texto");
	} else  if (letras[1] == "E") {
		resultado = resultado.concat("Sílabas");
	}
	return resultado;
}


function getComps(repN, tN) {
	comps = "";
	for (var i = 1; i <= 14; i++) {
		if (parsedFiles[repN][tN]["Comp"+i] == "") {
			break;
		}
		if (i > 1) {
			comps = comps.concat("/");
		}
		comps = comps.concat(parsedFiles[repN][tN]["Comp"+i]);
	}
	return comps;
}

function numToString(num) {
	var stringtext = "";
	var stringnum = num.toString();
	stringnum = stringnum.split("");
	var len = stringnum.length;
	for (var i = 0; (i < len && i < stringnum.length); i++) {
		if (stringnum[i] == ".") {
			stringtext = stringtext.concat(",");
			len = i+4;
		} else {
			stringtext = stringtext.concat(stringnum[i]);
		}
	}
	return stringtext;
}

function loadDate() {
	var stringdate = "";
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	stringdate = stringdate.concat(year);
	if (month < 10) {
		stringdate = stringdate.concat("0");
	}
	stringdate = stringdate.concat(month);
	if (day < 10) {
		stringdate = stringdate.concat("0");
	}
	stringdate = stringdate.concat(day);
	stringdate = stringdate.concat("/");
	if (hour < 10) {
		stringdate = stringdate.concat("0");
	}
	stringdate = stringdate.concat(hour);
	stringdate = stringdate.concat("/");
	if (minutes < 10) {
		stringdate = stringdate.concat("0");
	}
	stringdate = stringdate.concat(minutes);
	return stringdate;
}

function computeLog(repN) {
	var printlog = [];
	printlog.push(["Data/Hora/Min","Tarefa","Tipo de Tarefa","Modelo","Comparações","Resposta","Tentativas","Latência da Tentativa (seg)","Latência da Tarefa (seg)","Resultado","Latência do Repertório (seg)","Acertos","Erros"]);
	for (var i = 0; i < parsedFiles[repN].length; i++) {
		for (var j = 0; j < log[repN]["t"+i+".attempts"]; j++) {
			var logline = ["",i+1,log[repN]["t"+i+".Tipo de Tarefa"],log[repN]["t"+i+".Modelo"],log[repN]["t"+i+".Comps"],log[repN]["t"+i+".a"+j+".response"],j+1,numToString(log[repN]["t"+i+".a"+j+".response_time"]),"",log[repN]["t"+i+".a"+j+".result"],"","",""];
			if (i == 0 && j == 0) {
				logline[0] = log[repN]["timeStamp"];
				logline[10] = numToString(log[repN]["rep_response_time"]);
				logline[11] = log[repN]["pos_result_num"];
				logline[12] = log[repN]["neg_result_num"];
			}
			if (j == log[repN]["t"+i+".attempts"]-1) {
				logline[8] = numToString(log[repN]["t"+i+".total_response_time"]);
			}
                        if(log[repN]["t"+i+".attempts"] == 5){
                            showNextTask();
                        }
			printlog.push(logline);
		}
	}
	return Papa.unparse(printlog, {
		quotes: [false,false,false,false,false,false,false,true,true,false,true,false,false],
		delimiter: ";",
               
	});
}
function geraArquivo (arquivo) {
    if(arquivo === undefined || arquivo === null) {
            //download(computeLog(0),'log_'+ log[0]['timeStamp']+'.csv', 'text/plain');
    download(computeLog(repN),'log_'+ log[repN]['timeStamp']+'.csv', 'text/plain')    
    }
        else {
  download(computeLog(repN),arquivo + '.csv','text/plain');
        }
}
function showCredits() {
	mainHtml = document.getElementById("content").innerHTML;
	var credHtml = "<div class=\"jumbotron\">";
	credHtml = credHtml.concat("<div class=\"header\">");
	credHtml = credHtml.concat("<div class=\"container\">");
	credHtml = credHtml.concat("<h3>Sobre o projeto</h3>");
	credHtml = credHtml.concat("<ul class=\"nav nav-pills\">");
	credHtml = credHtml.concat("<li>");
	credHtml = credHtml.concat("<button type=\"button\" onclick=\"loadMain()\" class=\"btn btn-primary\" style=\"color: #fff;\">");
	credHtml = credHtml.concat("<span class=\"glyphicon glyphicon-arrow-left\"></span> Voltar");
	credHtml = credHtml.concat("</button>");
	credHtml = credHtml.concat("</li>");
	credHtml = credHtml.concat("</ul>");
	credHtml = credHtml.concat("</div><!-- ./container -->");
	credHtml = credHtml.concat("</div><!-- ./header -->");
	credHtml = credHtml.concat("<div class=\"p-sobre\" style=\"text-align: center\">");
	credHtml = credHtml.concat("<p >SIEL - Sistema Inteligente de Ensino a Leitura Modulo Experimental Desktop de apresentação de tarefas<br>Versão 1.0</p>");
	credHtml = credHtml.concat("<img src=\"res/UFPA_Logo.png\" alt=\"UFPA\" style=\"height: 100px\">");
	credHtml = credHtml.concat("<p>UFPA - Universidade Federal do Pará</p>");
	credHtml = credHtml.concat("<img src=\"res/LINC_Logo.png\" alt=\"LINC\" style=\"height: 100px\">");
	credHtml = credHtml.concat("<p>Linc - Laboratório de Inteligência Computacional e Pesquisa Operacional.</p>");
	credHtml = credHtml.concat("<p>Site - <a href=\"http://linc.ufpa.br/\">http://linc.ufpa.br/</a></p>");
	credHtml = credHtml.concat("<p>Parcerias</p>");
	credHtml = credHtml.concat("<img src=\"res/Laai_Logo.png\" alt=\"Laai\" style=\"height: 100px\">");
	credHtml = credHtml.concat("<p>Laai - Laboratory Applied Artificial Intelligence</p>");
	credHtml = credHtml.concat("<p>Site - <a href=\"http://www.laai.ufpa.br/\">http://www.laai.ufpa.br/</a></p>");
	credHtml = credHtml.concat("<img src=\"res/ECCE_Logo.png\" alt=\"INCT|ECCE\" style=\"height: 100px\">");
	credHtml = credHtml.concat("<p>INCT|ECCE - Instituto Nacional de Ciência e Tecnologia sobre Comportamento, Cognição e Ensino.</p>");
	credHtml = credHtml.concat("<p>Site - <a href=\"http://www.inctecce.com.br/br/\">http://www.inctecce.com.br/br/</a></p>");
	credHtml = credHtml.concat("<p>Equipe do Projeto:</p>");
	credHtml = credHtml.concat("<p>Ádamo Santana </p>");
	credHtml = credHtml.concat("<p>Abner Cardoso </p>");
	credHtml = credHtml.concat("<p>André Fernandes</p>");
	credHtml = credHtml.concat("<p>Antonio Jacob</p>");
	credHtml = credHtml.concat("<p>Daniel Lopes</p>");
	credHtml = credHtml.concat("<p>Dionne Cavalcante</p>");
	credHtml = credHtml.concat("<p>Francielma dos Santos</p>");
	credHtml = credHtml.concat("<p>Gilberto Nerino</p>");
	credHtml = credHtml.concat("<p>Leonardo Brandão </p>");
	credHtml = credHtml.concat("<p>Marcia Fontes</p>");
	credHtml = credHtml.concat("<p>Pedro Montibeler</p>");
	credHtml = credHtml.concat("<p>Pedro Oliveira</p>");
	credHtml = credHtml.concat("</div>");
	credHtml = credHtml.concat("</div><!-- ./jumbotron -->");
	document.getElementById("content").innerHTML = credHtml;
}

function showInfo() {
	mainHtml = document.getElementById("content").innerHTML;
	var infHtml = "<div class=\"jumbotron\">";
	infHtml = infHtml.concat("<div class=\"header\">");
	infHtml = infHtml.concat("<div class=\"container\">");
	infHtml = infHtml.concat("<h3>Informações</h3>");
	infHtml = infHtml.concat("<ul class=\"nav nav-pills\">");
	infHtml = infHtml.concat("<li>");
	infHtml = infHtml.concat("<button type=\"button\" onclick=\"loadMain()\" class=\"btn btn-primary\" style=\"color: #fff;\">");
	infHtml = infHtml.concat("<span class=\"glyphicon glyphicon-arrow-left\"></span> Voltar");
	infHtml = infHtml.concat("</button>");
	infHtml = infHtml.concat("</li>");
	infHtml = infHtml.concat("<li><input type=\"button\" class=\"btn btn-primary\" onclick=\"generalInfo()\" value=\"Geral\"></li>");
	infHtml = infHtml.concat("<li><input type=\"button\" class=\"btn btn-primary\" onclick=\"repInfo()\" value=\"Arquivos de repertório\"></li>");
	infHtml = infHtml.concat("<li><input type=\"button\" class=\"btn btn-primary\" onclick=\"wordsInfo()\" value=\"Arquivos de palavras\"></li>");
	infHtml = infHtml.concat("<li><input type=\"button\" class=\"btn btn-primary\" onclick=\"reforcoInfo()\" value=\"Arquivos de reforço\"></li>");
	infHtml = infHtml.concat("</ul>");
	infHtml = infHtml.concat("</div><!-- ./container -->");
	infHtml = infHtml.concat("</div><!-- ./header -->");
	infHtml = infHtml.concat("<div id=\"info\"></div>");
	infHtml = infHtml.concat("</div><!-- ./jumbotron -->");
	document.getElementById("content").innerHTML = infHtml;
	generalInfo();
}

function generalInfo() {
	var infHtml = "<h3>Carregando repertório</h3>";
	infHtml = infHtml.concat("Os arquivos \".csv\" de repertório, que possuem a definição de várias tarefas que compõe uma sessão, podem ser carregados clicando no botão \"Selecionar arquivo...\" e selecionando-os.");
	infHtml = infHtml.concat("<br>Uma vez carregados, é possível editá-los clicando no botão \"editar repertório\" correspondente na tabela de repertórios. Durante a edição é possível definir quais tarefas exibirão reforço (visual ou sonoro) durante sua execução,");
	infHtml = infHtml.concat("  e pode-se remover tarefas de um repertório; ressaltando que, para confirmar quaisquer modificações, deve-se clicar no botão \"Confirmar ações\". É possível também remover um repertório clicando no botão \"remover repertório\", removendo seus dados da tabela.");
	infHtml = infHtml.concat("<h3>Executando repertório</h3>");
	infHtml = infHtml.concat("Clicando no botão \"executar repertório\", inicia-se uma sessão de resolução de tarefas.");
	infHtml = infHtml.concat(" Um grande botão verde aguardará confirmação para iniciar as atividades, e então cada tarefa do determinado repertório será exibida em ordem para o aluno responder, tal como definido no arquivo de repertório.");
	infHtml = infHtml.concat(" Após todas as tarefas serem respondidas, a sessão é encerrada e a aplicação retorna a tela inicial.");
	infHtml = infHtml.concat("<h3>Resultados de sessão</h3>");
	infHtml = infHtml.concat("No término de uma sessão, os resultados estarão disponíveis para visualização clicando no novo botão \"exibir log\" na tabela de repertórios. Todos os dados coletados durante a execução das tarefas daquele repertório serão apresentados.");
	infHtml = infHtml.concat(" Para preservar os resultados, é possível baixar o log em formato \".csv\" para análise posterior.");
	infHtml = infHtml.concat("<h3>Importante</h3>");
	infHtml = infHtml.concat("Para experiência ótima com a aplicação, recomenda-se:<br>");
	infHtml = infHtml.concat("<ul>");
	infHtml = infHtml.concat("<li>Utilizar os navegadores Google Chrome ou Mozilla Firefox, atualizados para suas versões mais recentes.</li>");
	infHtml = infHtml.concat("<li>Verificar que o conteúdo dos <a onclick=\"repInfo()\" style=\"cursor: pointer\">arquivos de repertório</a> estejam conforme definido.</li>");
	infHtml = infHtml.concat("<li>Verificar que os <a onclick=\"wordsInfo()\" style=\"cursor: pointer\">arquivos de palavras</a> estejam no formato aceito, na pasta correta e com nomeação consistente.</li>");
	infHtml = infHtml.concat("<li>Contatar os associados do laboratório LINC no evento de comportamento inesperado da aplicação.</li>");
	infHtml = infHtml.concat("</ul>");
	document.getElementById("info").innerHTML = infHtml;
}

function repInfo() {
	var infHtml = "<h3>Arquivos</h3>";
	infHtml = infHtml.concat("Os arquivos de repertório, que possuem a definição de várias tarefas que compõe uma sessão, podem ser carregados para execução na página inicial, apertando o botão \"Selecionar arquivo...\".");
	infHtml = infHtml.concat("<br>As colunas necessárias para se definir o arquivo são as seguintes: \"Tipo de Tarefa\" para se definir, com código de letras, quais objetos constituem a tarefa, \"Modelo\" para informar a palavra");
	infHtml = infHtml.concat(" que corresponde ao resultado correto da tarefa, e \"Comp1\" até \"Comp14\" para inserir quais palavras, sem contar a palavra modelo, serão dadas como opção para o aluno responder;");
	infHtml = infHtml.concat(" note que embora se tenha 14 colunas \"Comp#\" disponíveis no repertório, cada tarefa deve preencher apenas quantas forem necessárias, dado o número de palavras adicionais a se oferecer como resposta a tarefa.");
	infHtml = infHtml.concat(" Os nomes que identificam as colunas devem estar de acordo com o modelo, pois são utilizados como cabeçalhos pelo sistema para identificar corretamente os dados no arquivo.");
	infHtml = infHtml.concat("<br>Os arquivos de formato \".csv\" podem ser editados como tabelas por programas próprios, tal como Microsoft Excel ou LibreOffice Calc. Podem também serem editados como arquivos simples de texto com o bloco de notas;");
	infHtml = infHtml.concat(" nesse caso em especial, todos os valores que devem ser divididos em colunas estarão dividos por ponto e vírgula. Preserve a divisão das colunas mantendo o número adequado de pontos e vírgulas, mesmo em campos não preenchidos.");
	infHtml = infHtml.concat("<h3>Código de letras</h3>");
	infHtml = infHtml.concat("A estrutura da tarefa é definida utilizando um código de 2 letras maiúsculas, onde a primeira letra define a forma que a palavra modelo é apresentada, e a segunda letra define a forma que as opções de resposta são apresentadas.");
	infHtml = infHtml.concat("<br>A primeira letra pode ser: \"A\": Palavra modelo é ditada por um arquivo de áudio; \"B\": Palavra modelo é ilustrada por um arquivo de imagem; \"C\": Palavra modelo é apresentada em texto.<br>");
	infHtml = infHtml.concat("A segunda letra pode ser: \"B\": Opções de resposta são ilustradas por arquivos de imagem; \"C\": Opções de resposta são apresentadas em texto; \"E\": Opções de resposta são apresentadas divididas em sílabas para a composição da resposta;");
	infHtml = infHtml.concat("<br>Ex: AE = Modelo é um áudio, opções são sílabas; BC = Modelo é uma imagem, opções estão escritas.");
	infHtml = infHtml.concat("<h3>Preenchendo a tabela com palavras</h3>");
	infHtml = infHtml.concat("Escreva as palavras nos campos \"Modelo\" e \"Comp#\" para que sejam utilizadas nas tarefas. Lembre de que a escrita das palavras deve coincidir com os <a onclick=\"wordsInfo()\" style=\"cursor: pointer\">arquivos de palavras</a>.");
	infHtml = infHtml.concat("<br>A exceção são as tarefas com sílabas (código de letra E): Nessas tarefas, as palavras modelo e comparações devem ser preenchidas separando-se suas sílabas com traços \"-\". Isso não afeta o nome dos arquivos de palavra. Ex: modelo é \"bo-lo\", arquivo é \"bolo.jpg\".");
	infHtml = infHtml.concat("<h3>Exemplo de tabela</h3>");
	infHtml = infHtml.concat("<table class=\"table table-striped table-bordered table-hover table-condensed\">");
	infHtml = infHtml.concat("<tr><th>Tipo de Tarefa</th><th>Modelo</th><th>Comp1</th><th>Comp2</th><th>Comp3</th><th>Comp4</th><th>Comp5</th><th>...</th><th>Comp14</th></tr>");
	infHtml = infHtml.concat("<tr><td>AC</td><td>bolo</td><td>pato</td><td>bala</td></tr>");
	infHtml = infHtml.concat("<tr><td>BE</td><td>ba-la</td><td>pa-to</td><td>bo-lo</td></tr>");
	infHtml = infHtml.concat("<tr><td>BC</td><td>bala</td><td>pato</td><td>bolo</td><td>pipa</td><td>tomate</td><td>luva</td></tr>");
	infHtml = infHtml.concat("</table>");
	infHtml = infHtml.concat("<input type=\"button\" class=\"btn btn-primary\" onclick=\"download('Tipo de Tarefa;Modelo;Comp1;Comp2;Comp3;Comp4;Comp5;Comp6;Comp7;Comp8;Comp9;Comp10', 'rep.csv', 'text/plain')\" value=\"Baixar modelo de repertório\">");
	document.getElementById("info").innerHTML = infHtml;
}

function wordsInfo() {
	var infHtml = "<h3>Imagens</h3>";
	infHtml = infHtml.concat("Os arquivos de imagem que ilustram as palavras das tarefas devem ser colocadas na pasta \"palavras/img/\".<br>A escrita do nome deve coincidir com a escrita no repertório, sempre de forma íntegra, sem divisão em sílabas.");
	infHtml = infHtml.concat("<br>Único formato suportado: \".jpg\". Ex: bolo.jpg");
	infHtml = infHtml.concat("<h3>Áudio</h3>");
	infHtml = infHtml.concat("Os arquivos de áudio que ditam as palavras das tarefas devem ser colocadas na pasta \"palavras/sfx/\".<br>A escrita do nome deve coincidir com a escrita no repertório, sempre de forma íntegra, sem divisão em sílabas.");
	infHtml = infHtml.concat("<br>Formato suportados: \".wav\", \".mp3\" e \".ogg\". Ex: bolo.wav");
	infHtml = infHtml.concat("<h3>Importante</h3>");
	infHtml = infHtml.concat("Tarefas que usem imagens ou sons cujo arquivos de imagem e/ou áudio estejam faltando, ou nomeados incorretamente (ex: palavra é \"bolo\", arquivo é \"Bolo.jpg\") não funcionarão corretamente.");
	document.getElementById("info").innerHTML = infHtml;
}

function reforcoInfo() {
	var infHtml = "<h3>Arquivos de reforço</h3>";
	infHtml = infHtml.concat("Esses arquivos encontram-se na pasta \"reforco/\", com os nomes dos arquivos de imagem e áudio sendo \"positivo\" e \"negativo\".");
	infHtml = infHtml.concat(" Para alterar os objetos de reforço, substitua os arquivos da pasta com outras imagens (\".jpg\") e/ou outros arquivos de áudio (\".wav\", \".mp3\" ou \".ogg\") com mesmo nome dos arquivos originais.");
	infHtml = infHtml.concat("<h3>Arquivos em efetivo</h3>");
	infHtml = infHtml.concat("<div class=\"table-responsive\">");
	infHtml = infHtml.concat("<table class=\"table table-striped table-bordered table-hover table-condensed\">");
	infHtml = infHtml.concat("<tr><th>Imagem de reforço positivo</th><th>Imagem de reforço negativo</th></tr>");
	infHtml = infHtml.concat("<tr>");
	infHtml = infHtml.concat("<td><img src=\"reforco/positivo.jpg\" style=\"width: 140px; height: 140px;\"></td>");
	infHtml = infHtml.concat("<td><img src=\"reforco/negativo.jpg\" style=\"width: 140px; height: 140px;\"></td>");
	infHtml = infHtml.concat("</tr>");
	infHtml = infHtml.concat("<tr><th>Áudio de reforço positivo</th><th>Áudio de reforço negativo</th></tr>");
	infHtml = infHtml.concat("<tr>");
	infHtml = infHtml.concat("<td><audio controls><source src=\"reforco/positivo.wav\" type=\"audio/wav\"><source src=\"reforco/positivo.mp3\" type=\"audio/mpeg\"><source src=\"reforco/positivo.ogg\" type=\"audio/ogg\"></audio></td>");
	infHtml = infHtml.concat("<td><audio controls><source src=\"reforco/negativo.wav\" type=\"audio/wav\"><source src=\"reforco/negativo.mp3\" type=\"audio/mpeg\"><source src=\"reforco/negativo.ogg\" type=\"audio/ogg\"></audio></td>");
	infHtml = infHtml.concat("</tr>");
	infHtml = infHtml.concat("</table>");
	infHtml = infHtml.concat("</div><!-- ./table-responsive -->");
	document.getElementById("info").innerHTML = infHtml;
}
