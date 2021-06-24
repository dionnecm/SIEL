/*
 * siel-task.js
 *
 * Created on 25/02/2015
 *
 *
 * SIEL's task presentation control methods
 *
 * @version Revision 1.1.0
 * @since Build 1.0 (02 2015)
 * @author Pedro Montibeler
 */
var instrutor,idade,hora,aluno,data,arquivo;
  var r = 0; // Referencia o número do repertório
var t = 0; // Referencia o número da tarefa do repertório corrente
var Ntasks; // Armazena número total de tarefas do repertório corrente
var tasksHtml = []; // Armazena o conteúdo HTML das tarefas à serem exibidas
var currentTaskHtml; // Armazena temporariamente o conteúdo HTML da tarefa atual
var reforcoPosHtml; // Armazena o conteúdo HTML do reforço positivo
var reforcoNegHtml; // Armazena o conteúdo HTML do reforço negativo
var respostaCerta = false; // Verifica se resposta certa foi dada
var respostaErrada = false; // Verifica se resposta errada foi dada
var timeCheckIn; // Marca o tempo em que uma tarefa é exibida
var timeCheckOut; // Marca o tempo em que uma tarefa é respondida

// Funções não utilizadas
/*function ajaxGetTask(numTask) {
	var modo = sessionStorage["r"+r+".t"+i+".task_type"];
	var hw = sessionStorage["r"+r+".t"+i+".head_word"];
	var w = sessionStorage["r"+r+".t"+i+".words"];
	var s = sessionStorage["r"+r+".t"+i+".sils"];
	w = w.split(",");
	s = s.split(",");
	var query_str = "task.php?task_type="+modo+"&wordh="+hw;
	for (var i = 1; i < w.length; i++) {
		query_str = query_str.concat("&words[]="+w[i]);
		query_str = query_str.concat("&sils[]="+s[i]);
	}
	$.ajax({
  		url:query_str,
  		//async: false,
  		success: function(response){
  			tasksHtml[numTask] = response;
  			var hidden = document.getElementById("hidden");
  			hidden.innerHTML = hidden.innerHTML + response;
  			if (numTask == t) {
  				showNextTask();
  			}
  		}
	});
}

function loadTasks() {
	for (var i=0;i<Ntasks;i++) {
		ajaxGetTask(i);
	}
}*/
//função que pega a hora no momento em que a pagina eh carregada
function gethora () {
	//crio um objeto data
var d = new Date();

hora = d.getHours();
var minutos = d.getUTCMinutes();
var dia = d.getUTCDate();
var mes = d.getUTCMonth() + 1;
var ano = d.getUTCFullYear();
var data = dia + "/"  + mes + "/" + ano;
var horacompleta = hora + ":" + minutos;
//adiciona um 0 na frente do mes e dos minutos
if(minutos <= 9) {
	minutos = "0" + minutos;
	}
	if(mes <= 9){
	mes = "0" + mes;
}
//escreve no campo input de id hora a hora atual
$( "#hora" ).val(function() {
  return horacompleta;
});
//no input de id data,escrevo a data
$("#data").val(function () {
return data;
});
}
    
//essa função guarda os valores do formulario para posteriormente inseri-los no nome do arquivo de log 
function guardaValores() {
    instrutor = $("#instrutor").val();
    aluno = $("#aluno").val();
    idade = $("#idade").val();
    data = $("#data").val();
    hora = $("#hora").val();
    arquivo =  aluno + "_" + instrutor + "_" + idade + "-" + data + "-" + hora;
if(instrutor == "" || aluno == "" || idade == "" || instrutor == null ||aluno == null || idade == null) {
    $("#confirma").attr("type","submit");
}else {
  $("#confirma").attr("data-dismiss","modal");
}
}
function insereDados()  {
    var resposta = confirm("Deseja Inserir Dados da Sessão ?");
    if(resposta){
    showModal();
    }
}
//função que armazena o nome do aluno para poder incluir no salvamento do log.csv
function askName () {
 //aluno   = prompt("Digite o nome do aluno");
 var formulario = '<form method="POST" enctype="multipart/form-data" class=/"form-horizontal/" id="formulario">';
   formulario = formulario.concat('<div class="form-group"><label for ="nome" class="control-label">Nome do Aluno : </label>');
  formulario = formulario.concat('<div><input type="text" placeholder="nome do aluno" name="aluno" id="aluno" autofocus maxlength="8" required></div></div>');
 formulario =formulario.concat('<div class="form-group"><label for ="idade" class="control-label">Idade : </label>');
 formulario = formulario.concat('<div><input type="number"  name="idade" id="idade" maxlength="1" required><br/></div>');
 formulario = formulario.concat('<div class="form-group"><label for ="nome-instrutor">Nome do Instrutor : </label>');
 formulario = formulario.concat('<div><input type="text" placeholder="Nome do Instrutor" name="instrutor" id="instrutor" autofocus required maxlength="8"></div></div>');
  formulario =formulario.concat('<div class="form-group"><label for="data" class="control-label">Data : </label>');
  formulario =formulario.concat('<div><input type="text" id="data"><br/></div></div>');
  formulario =formulario.concat('</div><div class="form-group"><label for ="hora" class="control-label">Hora : </label>');
 formulario =formulario.concat('<div><input type="text" name="data" id="hora"><br/></div></div>');
 //formulario =formulario.concat('<label>Mostrar Tutorial ?</label><br><input type="radio" name="tutorial"/>Sim<input type="radio" name="tutorial">Não</form>');
formulario = formulario.concat('<div class="modal-footer"><button type="button" class="btn btn-primary" onclick="guardaValores()" id="confirma">Salvar</button></form>');
formulario = formulario.concat('<button type="button" class="btn btn-danger" data-dismiss="modal">Fechar</button></div>');
$("#formulario").html(formulario);
}
function beginSession() { // Exibe o botão "play" inicial, altera para tela cheia
       
    $("#task").html("<div class=\"header\"><div class=\"container\" style=\"text-align: center\"><input type=\"image\" src=\"res/play.jpg\" alt=\"SIEL Play\" onclick=\"showNextTask()\"></div></div>");
	//toggleFullScreen();
}

function playIntro() { // Exibe o ícone do SIEL em Fade In, para marcar o começo da sessão
        toggleFullScreen();	
        $("#task").html("<div class=\"header\"><div class=\"container\" style=\"text-align: center\"><img id=\"logoSIEL\" src=\"res/SIEL_Logo.png\" alt=\"SIEL\" style=\"display: none\"></div></div>");
	$("#logoSIEL").fadeIn(3000,beginSession); // Efeito de 3 segundos, então exibe primeira tarefa
}

function playOutro() { // Exibe o ícone do SIEL em Fade Out, para marcar o fim da sessão
	$("#task").html("<div class=\"header\"><div class=\"container\" style=\"text-align: center\"><img id=\"logoSIEL\" src=\"res/SIEL_Logo.png\" alt=\"SIEL\"></div></div>");
	$("#logoSIEL").fadeOut(3000,endSession); // Efeito de 3 segundos, então encerra sessão         

}

function endSession() { // Desativa a tela cheia, volta a página inicial
	//toggleFullScreen();
	loadMain();
        //geraArquivo(arquivo);
        
        if(arquivo === undefined || arquivo === null) {
            //download(computeLog(0),'log_'+ log[0]['timeStamp']+'.csv', 'text/plain');
    download(computeLog(r),'log_'+ log[r]['timeStamp']+'.csv', 'text/plain')    
    }
        else {
  download(computeLog(r),arquivo + '.csv','text/plain');
        }
        // Insere o botão de "exibir resultado" na tabela de repertórios
	
    if (document.getElementById("rep-table").rows[r+1].cells[5] == null) {
		var cell5 = document.getElementById("rep-table").rows[r+1].insertCell(5);
		cell5.innerHTML = "<span onclick=\"showLog('"+fileNames[r]+"',"+r+")\" class=\"glyphicon glyphicon-folder-open btn btn-primary\" title=\"exibir log\" style=\"color:#fff;\"></span>";
	}
}

function confirmExit() { // Exibe tela que confirma se deseja sair da sessão atual
	currentTaskHtml = document.getElementById("task").innerHTML;
	var confirmHtml = "<audio autoplay>";
	confirmHtml = confirmHtml.concat("<source src=\"res/confirmar.wav\" type=\"audio/wav\">");
	confirmHtml = confirmHtml.concat("<source src=\"res/confirmar.mp3\" type=\"audio/mpeg\">");
	confirmHtml = confirmHtml.concat("<source src=\"res/confirmar.ogg\" type=\"audio/ogg\">");
	confirmHtml = confirmHtml.concat("</audio>");
	confirmHtml = confirmHtml.concat("<div class=\"container marketing\">");
	confirmHtml = confirmHtml.concat("<div class=\"row\">");
	confirmHtml = confirmHtml.concat("<div class=\"col-lg-6 coluna\">");
	confirmHtml = confirmHtml.concat("<input type=\"image\" src=\"res/exit.png\" onclick=\"document.getElementById('task').innerHTML = currentTaskHtml;\" style=\"width: 300px; height: 300px\">");
	confirmHtml = confirmHtml.concat("</div><!-- /.col-lg-6 coluna -->");
	confirmHtml = confirmHtml.concat("<div class=\"col-lg-6 coluna\">");
	confirmHtml = confirmHtml.concat("<input type=\"image\" src=\"res/thumbs_up.png\" onclick=\"playOutro()\" style=\"width: 300px; height: 300px\">");
	confirmHtml = confirmHtml.concat("</div><!-- /.col-lg-6 coluna -->");
	confirmHtml = confirmHtml.concat("</div><!-- /.row -->");
	confirmHtml = confirmHtml.concat("</div><!-- /.container marketing -->");
	document.getElementById("task").innerHTML = confirmHtml;
}

function loadTasksLocal(repN) { // Gera o HTML das tarefas de um repertório, recebendo o ID numérico desse repertório
	log[repN] = []; // Vetor onde resultados de log serão salvos
	log[repN]["dataSaved"] = true; // Informa que repertório possui dados salvos
	log[repN]["timeStamp"] = loadDate(); // Salva data/hora do começo da sessão
	log[repN]["rep_response_time"] = 0;
	log[repN]["pos_result_num"] = 0;
	log[repN]["neg_result_num"] = 0;
	mainHtml = document.getElementById("content").innerHTML;
	// Insere HTML que servirá como "background" pro HTML das tarefas
	document.getElementById("content").innerHTML = "<div class=\"vertical-center\"><div id=\"task\"></div></div><div id=\"hidden\"></div>";
	r = repN;
	t = 0;
	// Gera o HTML das telas de reforço positivo e negativo
	reforcoPosHtml = generateReforcoHtml("pos", "reforco/positivo.jpg", "reforco/positivo");
	reforcoNegHtml = generateReforcoHtml("neg", "reforco/negativo.jpg", "reforco/negativo");
	// Armazena HTML no div "hidden" invisível, para que o navegador faça cache de seu conteúdo antes mesmo de exibi-lo
	var hidden = document.getElementById("hidden");
	hidden.innerHTML = hidden.innerHTML + reforcoPosHtml;
	hidden.innerHTML = hidden.innerHTML + reforcoNegHtml;
	Ntasks = parsedFiles[repN].length;
	for (var i=0;i<Ntasks;i++) { // Gera o HTML para cada tarefa, passando os dados do repertório
		var modo = parsedFiles[repN][i]["Tipo de Tarefa"];
		var w = [];
		w.push(parsedFiles[repN][i]["Modelo"]);
		for (var j = 1; j <= 14; j++) {
			if (parsedFiles[repN][i]["Comp"+j] == "") {
				break;
			}
			w.push(parsedFiles[repN][i]["Comp"+j]);
		}
		tasksHtml[i] = generateTaskHtml(repN, i, modo, w);
		// Armazena HTML no div "hidden" invisível, para cache
		hidden.innerHTML = hidden.innerHTML + tasksHtml[i];
		if (i == t) { // Assim que a primeira tarefa estiver armazenada, já pode iniciar a sessão 
                        playIntro();
                       // beginSession();
		}
	}
//após carregar o player,elimina o background cinza do corpo
$("body").css("background-color","transparent");
}

function checkReforco() { // Verifica se tarefa é treino ou não
	/*if (reforcoIndex[r][t][0] || reforcoIndex[r][t][1]) {
		showReforco(); // Se for, exibe reforço
        //      se o aluno errar mais de 5 vezes
        if (log[r]["t"+t+".attempts"] > 2) {
            		showReforco();
            	//chamo a proxima tarefa,incrementando o indice de tarefa    e chamando o metodo q monta o html da proxima tarefa   
            		t++;
                   showNextTask();
               } 
  	console.log(log[r]["t"+t+".attempts"]);
    }*/
if (reforcoIndex[r][t][0] || reforcoIndex[r][t][1]) { // Verifica se tarefa é treino ou não
         
        // Se for, exibe reforço
        showReforco();
        if (log[r]["t"+t+".attempts"] >  0) {
     // $("#task").html = generateTaskHtml(r,t, modo,w);
        w = [];
		w.push(parsedFiles[r][t]["Modelo"]);
                
		for (var j = 1; j <= 10; j++) {
			if (parsedFiles[r][t]["Comp"+j] == "") {
				break;
			}
			w.push(parsedFiles[r][t]["Comp"+j]);
		}
             modo = parsedFiles[r][t]["Tipo de Tarefa"]
           tasksHtml[t] = "";
            tasksHtml[t] = generateTaskHtml(r, t, modo, w);
           
		}
            //      se o aluno errar mais de 3 vezes 
        if (log[r]["t"+t+".attempts"] > 2) {
            //showReforco(); 
            //chamo a proxima tarefa,incrementando o indice de tarefa    e chamando o metodo q monta o html da proxima tarefa   
            showReforco();  
                t++;
           setTimeout(showNextTask,2000);
        }
}
    else {
		t++; // Se não, passa pra próxima tarefa
	            	
        showNextTask();
}
}
function showReforco() { // Exibe o reforço correspondente
	if (respostaCerta) {
		if (reforcoIndex[r][t][0]) { // Se reforço tipo imagem for verdadeiro
			$("#task").html(reforcoPosHtml);
		}
		if (reforcoIndex[r][t][1]) { // Se reforço tipo áudio for verdadeiro
			document.getElementById("r-pos-audio").play();
		}
		t++; // Se resposta é certa, avance a tarefa
	} else if (respostaErrada) {
		if (reforcoIndex[r][t][0]) { // Se reforço tipo imagem for verdadeiro
			$("#task").html(reforcoNegHtml);
		}
		if (reforcoIndex[r][t][1]) { // Se reforço tipo áudio for verdadeiro
			document.getElementById("r-neg-audio").play();
		}
	}
	setTimeout(showNextTask,2000); // Aguarda 2 segundos e exibe próxima tarefa
}

function showNextTask() { // Exibe tarefa
	sol_clear(); // Limpa dados de sílabas salvos, caso haja algum
	if (t > Ntasks - 1) { // Se alcançar o número final de tarefas, encerra sessão
		playOutro();
                
	} else if (tasksHtml[t]) { // Se conteúdo de tarefa existir, exiba seu conteúdo
		$("#task").html(tasksHtml[t]);
		if (progressIndex[r]) {
			var porcent = t*100/Ntasks;
			$("#p-bar").html("<div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\""+porcent+"\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+porcent+"%;\"><span class=\"sr-only\">"+porcent+"% Completo</span></div></div>");
		}
		// Limpe as variáveis de resposta
		respostaCerta = false;
		respostaErrada = false;
		checkaudiohword(); // Verifique se tarefa possui som a ser tocado
		timeCheckIn = new Date().getTime(); // Marca tempo de início de tarefa
		if (!(log[r]["t"+t+".attempts"] > 0)) { // Se não houver número salvo de tentativas, comece um contador
			log[r]["t"+t+".attempts"] = 0;
			log[r]["t"+t+".total_response_time"] = 0;
			log[r]["t"+t+".Tipo de Tarefa"] = parsedFiles[r][t]["Tipo de Tarefa"];
			log[r]["t"+t+".Modelo"] = parsedFiles[r][t]["Modelo"];
			log[r]["t"+t+".Comps"] = getComps(r, t);
		}
	}
}
 
function respondeu(escolha) { // Recebe a resposta clicada pelo usuário
	if (!respostaCerta && !respostaErrada) { // Se tarefa já foi respondida, botões devem parar de funcionar
		timeCheckOut = new Date().getTime(); // Marca tempo que foi dada a resposta
		// Salva diferença dos tempos em segundos (tempo total entre exibir tarefa e responder)
		log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".response_time"] = (timeCheckOut - timeCheckIn)/1000;
		log[r]["t"+t+".total_response_time"] += log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".response_time"];
		log[r]["rep_response_time"] += log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".response_time"];
		log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".response"] = escolha; // Salva qual foi a palavra respondida
		var modelo = parsedFiles[r][t]["Modelo"];
		var task_type = parsedFiles[r][t]["Tipo de Tarefa"];
		task_type = task_type.split("");
		if (task_type[1] == "E") { // Se tarefa for do típo sílaba, junte as sílabas da palavra modelo
			modelo = joinWord(modelo);
		}
		if (escolha == modelo) { // Se resposta coincidir, resposta correta
			log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".result"] = "CORRETO";
			log[r]["pos_result_num"]++;
			respostaCerta = true;
		} else { // Se não coincidir, resposta errada
			log[r]["t"+t+".a"+log[r]["t"+t+".attempts"]+".result"] = "INCORRETO";
			log[r]["neg_result_num"]++;
			respostaErrada = true;
                           
        }
		log[r]["t"+t+".attempts"]++; // Incrementa o número de tentativas
		checkReforco(); // Verifica por reforço
                
    }
    
}
function sol_add(silaba,id) { // Adiciona sílaba à resposta, recebe a sílaba e o id do botão clicado
/* 
por default os botões estão invisiveis,então quando o usuario clicar pela primeira vez em qualquer silaba
o sistema irá mostrar os botões
*/ 
var borracha = $("#borracha"); //salva a "borracha" nas tarefas de silaba
  var confirma = $("#check"); //salva o "botao confirma" nas tarefas de silaba

    borracha.css("visibility","visible");
    confirma.css("visibility","visible");
 
	  
	// Caso tarefa já tenha sido respondida, ou essa sílaba já tiver sido adicionada, faça nada
	if (!respostaCerta && !respostaErrada && !isInArray(id, silId)) {
		var numSil = 0;
		var possuiDados = (sessionStorage["SilabasSalvas"] == "true");
		if (possuiDados) { // Se storage possui sílabas salvas
			numSil = parseInt(sessionStorage["NumeroSilabas"]); // Recupere a quantidade de sílabas
		}
		numSil++; // Incrementa a quantidade de sílabas
		sessionStorage["sil."+numSil] = silaba; // Salve a sílaba
		sessionStorage["NumeroSilabas"] = numSil;
		sessionStorage["SilabasSalvas"] = true;
		// Adicione classe, pra diferenciar as sílabas já clicadas
		document.getElementById("sil"+id).className = "botao text-muted";
		silId.push(id); // Salve o id do botão correspondente à sílaba adicionada
		// Junte as sílabas já clicadas e exiba na tela
		var palavra = sol_join();
		$("#soletrando").html(palavra);
	}
}

function sol_rem() {
	/* 
quando o usuario remover a unica silaba q ele add,o sistema esconde novamente os botões,mostrando o somente
quando o usuario clicar novamente em qualquer silaba (metodo sol_add)
	*/
	var borracha = $("#borracha"); //salva a "borracha" nas tarefas de silaba
  var confirma = $("#check"); //salva o "botao confirma" nas tarefas de silaba

	if (!respostaCerta && !respostaErrada) { // Caso já tenha respondido, faça nada
		var numSil = 0;
		var possuiDados = (sessionStorage["SilabasSalvas"] == "true");
		if (possuiDados) { // Se storage possui sílabas salvas
			numSil = parseInt(sessionStorage["NumeroSilabas"]);
			sessionStorage.removeItem("sil."+numSil); // Remove a sílaba mais recente
			var id = silId.pop(); // Remova o id do botão dessa sílaba
			// Mude a classe desse botão para aparência voltar ao normal
			document.getElementById("sil"+id).className = "botao";
			numSil--; // Decremente quantidade de sílabas
			if (numSil > 0) { // Se ainda possui sílabas, atualize palavra na tela
				sessionStorage["NumeroSilabas"] = numSil;
				var palavra = sol_join();
				$("#soletrando").html(palavra);
			} else { // Se não, limpe o storage e esconda os botões

	 		borracha.css("visibility","hidden");
    		confirma.css("visibility","hidden");
	
				sol_clear();
			}
		}
		
	}
}

function sol_join() { // Percorre as sílabas salvas no storage e as concatena
	var palavra = "";
	var numSil = 0;
	var possuiDados = (sessionStorage["SilabasSalvas"] == "true");
	if (possuiDados) {
		numSil = parseInt(sessionStorage["NumeroSilabas"]);
	}
	for (i = 1; i <= numSil; i++) {
		palavra = palavra.concat(sessionStorage["sil."+i]);
	}
	return palavra;
}

function sol_end() { // Encerra tarefa de sílabas, envia sílabas concatenadas como resposta à tarefa
	if (!respostaCerta && !respostaErrada) {
		respondeu(sol_join());
	}
}

function sol_clear() { // Apaga todos dados de sílabas do storage
	var numSil = 0;
	var possuiDados = (sessionStorage["SilabasSalvas"] == "true");
	if (possuiDados) {
		numSil = parseInt(sessionStorage["NumeroSilabas"]);
		sessionStorage.removeItem("SilabasSalvas");
		sessionStorage.removeItem("NumeroSilabas");
	}
	for (i = 1; i <= numSil; i++) {
		sessionStorage.removeItem("sil."+i);
	}
	silId = [];
	$("#soletrando").html(" ");
}

function checkaudiohword(){ // Verifica se tarefa corrente possui item de áudio
	if (document.getElementById("h-word-audio-"+t)) {
		playhword();
	}
}

function playhword() { // Toca o item áudio da tarefa corrente
	if (!respostaCerta && !respostaErrada) {
		document.getElementById("h-word-audio-"+t).play();
	}
}