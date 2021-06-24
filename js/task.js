/*
 * task.js
 *
 * Created on 25/02/2015
 *
 *
 * SIEL's task presentation generation methods
 *
 * @version Revision 1.1.0
 * @since Build 1.0 (02 2015)
 * @author Pedro Montibeler
 */

 var silId = []; // Armazena id dos botões das tarefas de sílabas

// Gera HTML de exibição de uma tarefa, recebe o número do repertório, um número de ordem da tarefa, o tipo de tarefa e um vetor com as palavras (modelo e comparações)
function generateTaskHtml(num_rep, num_task, task_type, words) {
	var taskHtml = "";
   if (escIndex[num_rep]) {
	   taskHtml = taskHtml.concat("<input type=\"image\" src=\"res/saida_red.png\" onclick=\"confirmExit();\" style=\"height: 70px;\">");
   }
   taskHtml = taskHtml.concat("<div class=\"page-header\">");
   taskHtml = taskHtml.concat("<div class=\"container\">");
   var modo = task_type.split(""); // Divide o tipo de tarefa
   var wordh = words[0]; // Palavra modelo é a primeira palavra do vetor
   if (modo[1] == "E") { // Caso tarefa seja do tipo sílabas, junte as sílabas da palavra modelo
   	wordh = joinWord(wordh);
   }
   switch(modo[0]) { // Tipo de exibição da palavra modelo
   	case "A": // Exibe modelo como áudio
   		taskHtml = taskHtml.concat("<!-- Áudio -->");
   		taskHtml = taskHtml.concat("<input type=\"image\" src=\"res/Audio-icon.png\" onclick=\"playhword();\" style=\"width: 140px; height: 140px\">");
	      taskHtml = taskHtml.concat("<audio id=\"h-word-audio-"+num_task+"\" preload=\"auto\">");
   	   taskHtml = taskHtml.concat("<source src=\"palavras/sfx/"+wordh+".wav\" type=\"audio/wav\">");
	   taskHtml = taskHtml.concat("<source src=\"palavras/sfx/"+wordh+".mp3\" type=\"audio/mpeg\">");
	   taskHtml = taskHtml.concat("<source src=\"palavras/sfx/"+wordh+".ogg\" type=\"audio/ogg\">");
      	taskHtml = taskHtml.concat("</audio>");
      	break;
      case "B": // Exibe modelo como imagem
      	taskHtml = taskHtml.concat("<!-- Imagem -->");
      	taskHtml = taskHtml.concat("<img src=\"palavras/img/"+wordh+".jpg\" style=\"width: 140px; height: 140px;\">");
      	break;
      case "C": // Exibe modelo como texto
      	taskHtml = taskHtml.concat("<!-- Palavra -->");
		if (capsIndex[num_rep]) {
			taskHtml = taskHtml.concat("<h1 style=\"text-transform: uppercase;\">"+wordh+"</h1>");
		} else {
			taskHtml = taskHtml.concat("<h1 style=\"text-transform: lowercase;\">"+wordh+"</h1>");
		}
      	break;
   }
   taskHtml = taskHtml.concat("</div><!-- /.page-header -->");
   taskHtml = taskHtml.concat("</div><!-- /.container -->");
   taskHtml = taskHtml.concat("<div class=\"container marketing\">");
   words = shuffle(words); // Embaralha a ordem das palavras
   switch(modo[1]) { // Tipo de exibição das palavras
   	case "B": // Exibir palavras como imagens
   		var col_num = Math.max(Math.round(12/words.length),3); // Calcula número de colunas para acomodar as imagens
   		taskHtml = taskHtml.concat("<!-- Imagens -->");
   		taskHtml = taskHtml.concat("<div class=\"row\">");
   		for (var i = 0; i < words.length; i++) {
         	taskHtml = taskHtml.concat("<div class=\"col-lg-"+col_num+" coluna\">");
         	taskHtml = taskHtml.concat("<input type=\"image\" src=\"palavras/img/"+words[i]+".jpg\" onclick=\"respondeu('"+words[i]+"');\" style=\"width: 140px; height: 140px\">");
         	taskHtml = taskHtml.concat("</div><!-- /.col-lg-"+col_num+" coluna -->");
         }
         taskHtml = taskHtml.concat("</div><!-- /.row -->");
         break;
      case "C": // Exibir palavras como texto
      	var col_num = Math.max(Math.round(12/words.length),2); // Calcula número de colunas para acomodar as palavras
      	taskHtml = taskHtml.concat("<!-- Palavras -->");
         taskHtml = taskHtml.concat("<div class=\"row\">");
         for (var i = 0; i < words.length; i++) {
         	taskHtml = taskHtml.concat("<div class=\"col-lg-"+col_num+" coluna\">");
			if (capsIndex[num_rep]) {
				taskHtml = taskHtml.concat("<p class=\"botao\" onclick=\"respondeu('"+words[i]+"')\" style=\"text-transform: uppercase;\">"+words[i]+"</p>");
			} else {
				taskHtml = taskHtml.concat("<p class=\"botao\" onclick=\"respondeu('"+words[i]+"')\" style=\"text-transform: lowercase;\">"+words[i]+"</p>");
			}
         	taskHtml = taskHtml.concat("</div><!-- /.col-lg-"+col_num+" coluna -->");
         }
         taskHtml = taskHtml.concat("</div><!-- /.row -->");
         break;
      case "E": // Exibir palavras como sílabas
      	var silabas = "";
		// Junta todas as sílabas de todas as palavras
      	for (var i = 0; i < words.length; i++) {
      		silabas = silabas.concat(words[i]);
      		if (i < words.length - 1) {
      			silabas = silabas.concat("-");
      		}
      	}
      	silabas = silabas.split("-");
       
      	silabas = shuffle(silabas); // Embaralha as sílabas
      	var col_num = Math.max(Math.round(12/silabas.length),2); // Calcula número de colunas para acomodar as sílabas
      	taskHtml = taskHtml.concat("<!-- Sílabas -->");
         if (capsIndex[num_rep]) {
			 taskHtml = taskHtml.concat("<h1 id=\"soletrando\" style=\"text-transform: uppercase;\"></h1>");
		 } else {
			 taskHtml = taskHtml.concat("<h1 id=\"soletrando\" style=\"text-transform: lowercase;\"></h1>");
		 }
         taskHtml = taskHtml.concat("<div class=\"row\">");
         for (var i = 0; i < silabas.length; i++) {
         	taskHtml = taskHtml.concat("<div class=\"col-lg-"+col_num+" coluna\">");
			if (capsIndex[num_rep]) {
				taskHtml = taskHtml.concat("<p id=\"sil"+i+"\" class=\"botao\"onclick=\"sol_add('"+silabas[i]+"',"+i+")\" style=\"text-transform: uppercase;\">"+silabas[i]+"</p>");
			} else {
				taskHtml = taskHtml.concat("<p id=\"sil"+i+"\" class=\"botao\"onclick=\"sol_add('"+silabas[i]+"',"+i+")\" style=\"text-transform: lowercase;\">"+silabas[i]+"</p>");
			}
            taskHtml = taskHtml.concat("</div><!-- /.col-lg-"+col_num+" coluna -->");
            }
         taskHtml = taskHtml.concat("</div><!-- /.row -->");
         taskHtml = taskHtml.concat("<div class=\"row\">");
         taskHtml = taskHtml.concat("<div class=\"col-lg-6 coluna\" style=\"visibility : hidden;\" id=\"borracha\">");
         taskHtml = taskHtml.concat("<input type=\"image\" src=\"res/eraser.png\" onclick=\"sol_rem()\" style=\"width: 140px; height: 140px\">");
         taskHtml = taskHtml.concat("</div><!-- /.col-lg-6 coluna -->");
         taskHtml = taskHtml.concat("<div class=\"col-lg-6 coluna\"style=\"visibility : hidden;\"id=\"check\"> ");
         taskHtml = taskHtml.concat("<input type=\"image\" src=\"res/check.png\" onclick=\"sol_end()\" style=\"width: 140px; height: 140px\">");
         taskHtml = taskHtml.concat("</div><!-- /.col-lg-6 coluna -->");
         taskHtml = taskHtml.concat("</div><!-- /.row -->");
         break;
   }
   taskHtml = taskHtml.concat("</div><!-- /.container marketing -->");
   taskHtml = taskHtml.concat("<div class=\"container\">");
   taskHtml = taskHtml.concat("<div id=\"p-bar\"></div>");
   taskHtml = taskHtml.concat("</div><!-- /.container -->");
   return taskHtml;

}
   
// Gera o HTML do reforço, recebe o tipo de reforço (pos ou neg) e as URLs dos arquivos de reforço
function generateReforcoHtml(tipo, imgurl, somurl) {
	var reforcoHtml = "<div class=\"container reforco\">";
	if (imgurl != "") { // Se URL de imagem não for vazia, inclua no HTML
		reforcoHtml = reforcoHtml.concat("<img src=\""+imgurl+"\">");
	}
	if (somurl != "") { // Se URL de áudio não for vazia, inclua no HTML
	   reforcoHtml = reforcoHtml.concat("<audio id=\"r-"+tipo+"-audio\" preload=\"auto\">");
		reforcoHtml = reforcoHtml.concat("<source src=\""+somurl+".wav\" type=\"audio/wav\">");
		reforcoHtml = reforcoHtml.concat("<source src=\""+somurl+".mp3\" type=\"audio/mpeg\">");
		reforcoHtml = reforcoHtml.concat("<source src=\""+somurl+".ogg\" type=\"audio/ogg\">");
      reforcoHtml = reforcoHtml.concat("</audio>");
	}
	reforcoHtml = reforcoHtml.concat("</div><!-- /.container reforco -->");
	return reforcoHtml;
}

function joinWord(word) { // Junta as sílabas de uma palavra
	var sils = word.split("-");
	var joinh = "";
	for (var i = 0; i < sils.length; i++) {
		joinh = joinh.concat(sils[i]);
	}
	return joinh;
}

function shuffle(array) { // Método que embaralha um vetor
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function toggleFullScreen() { // Método que ativa/desativa tela cheia dos principais navegadores
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function isInArray(value, array) { // Verifica se um determinado valor está presente em um vetor
	return array.indexOf(value) > -1;
}