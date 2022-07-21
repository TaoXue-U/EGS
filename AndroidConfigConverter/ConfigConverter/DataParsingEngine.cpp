#include "DataParsingEngine.h"
#include "XmlManager.h"
#include "ConfigParser.h"
#include <QDomDocument>
#include <QDomProcessingInstruction>
#include <QDomElement>
#include <QDomText>
#include <QTextStream>
#include<stdio.h>
#include "Configconverter.h"
#include <QMessageBox>
#include <vector>

#include <cstring>
#include <cctype>
#include <sstream>
#include <string>
using namespace std;

const char* statementNodeName = "Allocation";
const char* textureFileNodeName = "file";
const char* baseFilterNodeName = "BaseFilter";
const char* srcNodeName = "src";
const char* dstNodeName = "dst";
const char* texNodeName = "tex";
const char* paramNodeName = "params";

char* srcTextName = "SRC";
char* dstTextName = "DST";
const char* tempTextName = "TMP";

char *strcut(const char *s, int m, int n)
{
	char *substr = new char[n + 1];
	int i;
	for (i=0;i<n;i++)
		substr[i]=s[m+i];
	substr[i]='\0';
	return(substr);
}

void trim(char*pStr)  
{  
	char *pTmp = pStr;  

	while (*pStr != '\0')   
	{  
		if (*pStr != ' ')  
		{  
			*pTmp++ = *pStr;  
		}  
		++pStr;  
	}  
	*pTmp = '\0';
} 


DataParsingEngine::DataParsingEngine(Configconverter* converter, const char* id, bool isBorderMode)
	: m_iTextureNum(0), m_iStepNum(0), m_iStepIndex(0),m_bIsConstColorAllocation(false),m_bIsCurveAllocation(false),m_pConverter(converter)
{
	blendModeParserString();
	if(isBorderMode)
		m_pXmlManager = new XmlManager(m_pConverter, "Frame", "name", "none", "type", "M", "id", id);
	else
		m_pXmlManager = new XmlManager(m_pConverter, "Effect", "name", "none", "type", converter->getCurrentComboxText().toStdString().c_str(), "id",  id);
	
}

DataParsingEngine::~DataParsingEngine()
{
	freeNodes(m_pXmlManager->root());
	m_pXmlManager->setRootNote(NULL);
	if(m_pXmlManager != NULL){
		delete m_pXmlManager;
		m_pXmlManager = NULL;
	}

	if(m_pConverter != NULL)
		m_pConverter = NULL;

	blendModeStringParser.clear();
	m_iTextureNum = 0;
	m_iStepNum = 0;
	m_iStepIndex = 0;
	m_bIsConstColorAllocation = false;
	m_bIsCurveAllocation = false;
}

void DataParsingEngine::freeNodes(XmlNode* node)
{
	int size = node->m_childNodes.size();
	if(node->m_childNodes.size() != 0)
	{
		vector<XmlNode*> nodes = node->m_childNodes;
		for(vector<XmlNode*>::iterator iter= nodes.begin(); iter!=nodes.end(); ++iter)  
		{  
			freeNodes(*iter);
		}  
	}
	else
	{
		delete node;
		node = NULL;
	}
}

//混合模式对应
void DataParsingEngine::blendModeParserString()
{
	blendModeStringParser.insert(pair<string, char*>("mix", "normal"));
	blendModeStringParser.insert(pair<string, char*>("dissolve", "dissolve"));
	blendModeStringParser.insert(pair<string, char*>("dsv", "dissolve"));
	blendModeStringParser.insert(pair<string, char*>("darken", "darken"));
	blendModeStringParser.insert(pair<string, char*>("dk", "darken"));
	blendModeStringParser.insert(pair<string, char*>("multiply", "multiply"));
	blendModeStringParser.insert(pair<string, char*>("colorburn", "color_burn"));
	blendModeStringParser.insert(pair<string, char*>("cb", "color_burn"));
	blendModeStringParser.insert(pair<string, char*>("linearburn", "linear_burn"));
	blendModeStringParser.insert(pair<string, char*>("lb", "linear_burn"));
	blendModeStringParser.insert(pair<string, char*>("darkercolor", "darker_color"));
	blendModeStringParser.insert(pair<string, char*>("dc", "darker_color"));
	blendModeStringParser.insert(pair<string, char*>("lt", "lighten"));
	blendModeStringParser.insert(pair<string, char*>("lighten", "lighten"));
	blendModeStringParser.insert(pair<string, char*>("sr", "screen"));
	blendModeStringParser.insert(pair<string, char*>("screen", "screen"));
	blendModeStringParser.insert(pair<string, char*>("cd", "color_dodge"));
	blendModeStringParser.insert(pair<string, char*>("colordodge", "color_dodge"));
	blendModeStringParser.insert(pair<string, char*>("ld", "linear_dodge"));
	blendModeStringParser.insert(pair<string, char*>("lineardodge", "linear_dodge"));
	blendModeStringParser.insert(pair<string, char*>("lc", "lighter_color"));
	blendModeStringParser.insert(pair<string, char*>("lightercolor", "lighter_color"));
	blendModeStringParser.insert(pair<string, char*>("ol", "overlay"));
	blendModeStringParser.insert(pair<string, char*>("overlay", "overlay"));
	blendModeStringParser.insert(pair<string, char*>("sl", "soft_light"));
	blendModeStringParser.insert(pair<string, char*>("softlight", "soft_light"));
	blendModeStringParser.insert(pair<string, char*>("hl", "hard_light"));
	blendModeStringParser.insert(pair<string, char*>("hardlight", "hard_light"));
	blendModeStringParser.insert(pair<string, char*>("vvl", "vivid_light"));
	blendModeStringParser.insert(pair<string, char*>("vividlight", "vivid_light"));
	blendModeStringParser.insert(pair<string, char*>("ll", "linear_light"));
	blendModeStringParser.insert(pair<string, char*>("linearlight", "linear_light"));
	blendModeStringParser.insert(pair<string, char*>("pl", "pin_light"));
	blendModeStringParser.insert(pair<string, char*>("pinlight", "pin_light"));
	blendModeStringParser.insert(pair<string, char*>("dm", "hard_mix"));
	blendModeStringParser.insert(pair<string, char*>("hardmix", "hard_mix"));
	blendModeStringParser.insert(pair<string, char*>("dif", "difference"));
	blendModeStringParser.insert(pair<string, char*>("difference", "difference"));
	blendModeStringParser.insert(pair<string, char*>("ec", "exclude"));
	blendModeStringParser.insert(pair<string, char*>("exclude", "exclude"));
	blendModeStringParser.insert(pair<string, char*>("sub", "subtract"));
	blendModeStringParser.insert(pair<string, char*>("subtract", "subtract"));
	blendModeStringParser.insert(pair<string, char*>("div", "divide"));
	blendModeStringParser.insert(pair<string, char*>("hue", "hue"));
	blendModeStringParser.insert(pair<string, char*>("sat", "saturation"));
	blendModeStringParser.insert(pair<string, char*>("saturation", "saturation"));
	blendModeStringParser.insert(pair<string, char*>("cl", "color"));
	blendModeStringParser.insert(pair<string, char*>("color", "color"));
	blendModeStringParser.insert(pair<string, char*>("lum", "luminosity"));
	blendModeStringParser.insert(pair<string, char*>("luminosity", "luminosity"));
}

void DataParsingEngine::blendParser(const char* pstr, ConfigParser* parser, const char* type)
{
	char modeName[32], textureName[128];
	int intensity;

	if(sscanf(pstr, "%31s%127s%d", modeName, textureName, &intensity) != 3 && sscanf(pstr, "%31s%d", modeName,  &intensity) != 2)
	{
		return;
	}
	float fIntensity = intensity / 100.0f;
	char* sIntensity  = new char[32];
	char* sTextureNum = new char[32];
	sprintf(sIntensity, "%.2f", fIntensity);

	char* blendName= blendModeStringParser[modeName];
	char* textureVariablesName;
	string s= getTextureVariablesName(textureVariablesName);
	textureVariablesName = const_cast<char*>(s.c_str());

	
	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);

	XmlNode* AllocationTexNode = new XmlNode(m_pXmlManager, statementNodeName, "name", textureVariablesName,  NULL);
	XmlNode* textFileNode = new XmlNode(m_pXmlManager, textureFileNodeName, NULL, NULL, textureName);
	AllocationTexNode->appendChild(textFileNode);

	XmlNode* baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "LayerBlend", NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	if(strncmp(type, "selfblend", 8) == 0)
			textureVariablesName = srcTextName;
	XmlNode* texNode = new XmlNode(m_pXmlManager, texNodeName, NULL, NULL, textureVariablesName);
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(texNode);
	baseFilterNode->appendChild(dstNode);

	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);

	XmlNode* paramModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, blendName);
	XmlNode* paramOpacityNode = new XmlNode(m_pXmlManager, "opacity", NULL, NULL, sIntensity);
	if(strncmp(type, "krblend", 7) == 0)
	{
		XmlNode* paramsTypeNode = new XmlNode(m_pXmlManager, "type", NULL, NULL, "center");
		paramsNode->appendChild(paramsTypeNode);
	}
	else if(strncmp(type, "tile", 4) == 0)
	{
		XmlNode* tileTypeNode = new XmlNode(m_pXmlManager, "type", NULL, NULL, "tile");
		paramsNode->appendChild(tileTypeNode);
	}

	paramsNode->appendChild(paramModeNode);
	paramsNode->appendChild(paramOpacityNode);
	baseFilterNode->appendChild(paramsNode);
	if(strncmp(type, "selfblend", 8) != 0)
		m_pXmlManager->root()->appendChild(AllocationTexNode);
	m_pXmlManager->root()->appendChild(baseFilterNode);
	delete sIntensity;
	delete sTextureNum;
}

const char* curveTextureName = "tableTexture";
const char* tableTextureNodeName = "tableTexture";
const char* tableTextureTextName = "texturing";
void DataParsingEngine::curveParser(const char* ptr, ConfigParser* parser)
{
	int timeR = 0;
	int timeG = 0;
	int timeB = 0;
	bool isVisited  = false;
	bool isA = false;
	bool isB = false;
	char* rgbText ;
	//XmlNode Tree
	XmlNode* AllocationTexNode = new XmlNode(m_pXmlManager, statementNodeName, "name", curveTextureName,  NULL);
	XmlNode* baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "Curve", NULL);
	XmlNode* tableTextureNode = new XmlNode(m_pXmlManager, tableTextureNodeName, NULL, NULL, curveTextureName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* paramModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, tableTextureTextName);
	paramsNode->appendChild(paramModeNode);

	XmlNode* rNode = nullptr;
	XmlNode* bNode = nullptr;
	XmlNode* gNode = nullptr;

	for(int i = 0; ptr[i] != '\0' && ptr[i] != '@';)
	{
		switch (ptr[i])
		{
		case 'R': case 'r':	
			if(toupper(ptr[i + 1]) == 'G' && toupper(ptr[i + 2]) == 'B')
			{
				//RGB
				i += 3;

				int j = i;
				int count=0;
				for (char c = toupper(ptr[j]); c != '\0' && c != '@' && c!= 'R' && c!= 'G' && c!= 'B';j++)
				{
					c = toupper(ptr[j]);
					count++;
				}
				
				rgbText = strcut(ptr, i, count - 1);
				trim(rgbText);
				
				timeR++;timeG++;timeB++;
				if(timeR > 1 || timeG > 1 || timeB > 1)
				{
					m_iStepNum++;
				}

				isA = true;
			}
			else
			{
				++i;
				int j = i;
				int count=0;
				for (char c = toupper(ptr[j]); c != '\0' && c != '@' && c!= 'R' && c!= 'G' && c!= 'B';j++)
				{
					c = toupper(ptr[j]);
					count++;
				}

				char* rgbText = strcut(ptr, i, count - 1);
				 trim(rgbText);
				rNode = new XmlNode(m_pXmlManager, "R", NULL, NULL, rgbText);
				//paramsNode->appendChild(rNode);
				timeR++;
				if(timeR > 1 && !isVisited)
				{
					isVisited = true;
					m_iStepNum++;
				}
				isB = true;
			}
			break;
		case 'G': case 'g':
			++i;
			{
				int j = i;
				int count=0;
				for (char c = toupper(ptr[j]); c != '\0' && c != '@' && c!= 'R' && c!= 'G' && c!= 'B';j++)
				{
					c = toupper(ptr[j]);
					count++;
				}

				char* rgbText = strcut(ptr, i, count - 1);
				 trim(rgbText);
				gNode = new XmlNode(m_pXmlManager, "G", NULL, NULL, rgbText);
				//paramsNode->appendChild(gNode);
				timeG++;
				if(timeG > 1 && !isVisited)
				{
					isVisited = true;
					m_iStepNum++;
				}
				isB = true;
			}
			break;
		case 'B': case 'b':
			++i;
			{
				int j = i;
				int count=0;
				for (char c = toupper(ptr[j]); c != '\0' && c != '@' && c!= 'R' && c!= 'G' && c!= 'B';j++)
				{
					c = toupper(ptr[j]);
					count++;
				}

				char* rgbText = strcut(ptr, i, count - 1);
				trim(rgbText);
				bNode = new XmlNode(m_pXmlManager, "B", NULL, NULL, rgbText);
				//paramsNode->appendChild(bNode);
				timeB++;
				if(timeB > 1 && !isVisited)
				{
					isVisited = true;
					m_iStepNum++;
				}
				isB = true;
			}
			break;
		default:				
			++i;
			break;
		}
	}
	if(isB){
		if(rNode == nullptr)
			rNode = new XmlNode(m_pXmlManager, "R", NULL, NULL, "(0, 0)(255, 255)"); 
		if(gNode == nullptr)
			gNode = new XmlNode(m_pXmlManager, "G", NULL, NULL, "(0, 0)(255, 255)"); 
		if(bNode == nullptr)
			bNode = new XmlNode(m_pXmlManager, "B", NULL, NULL, "(0, 0)(255, 255)");

		paramsNode->appendChild(rNode);
		paramsNode->appendChild(gNode);
		paramsNode->appendChild(bNode);

		baseFilterNode->appendChild(tableTextureNode); 
		baseFilterNode->appendChild(paramsNode);

		if(!m_bIsCurveAllocation){
			m_pXmlManager->root()->appendChild(AllocationTexNode);
			m_bIsCurveAllocation = true;
		}
		m_pXmlManager->root()->appendChild(baseFilterNode);

		srcTextName = getSrcDstPic(true);
		dstTextName = getSrcDstPic(false);

		XmlNode* baseFilter1 =new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "TableTexture", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* tableTextureDstNode = new XmlNode(m_pXmlManager, tableTextureNodeName, NULL, NULL, tableTextureNodeName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);

		baseFilter1->appendChild(srcNode);
		baseFilter1->appendChild(dstNode);
		baseFilter1->appendChild(tableTextureDstNode);
		m_pXmlManager->root()->appendChild(baseFilter1);
	}

	if((timeR > 1 || timeG > 1 || timeB > 1) || isA){
		XmlNode* AllocationTexNode1 = new XmlNode(m_pXmlManager, statementNodeName, "name", curveTextureName,  NULL);
		XmlNode* baseFilterNode1 = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "Curve", NULL);
		XmlNode* tableTextureNode1 = new XmlNode(m_pXmlManager, tableTextureNodeName, NULL, NULL, curveTextureName);

		XmlNode* paramsNode1 = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* paramModeNode1 = new XmlNode(m_pXmlManager, "mode", NULL, NULL, tableTextureTextName);

		paramsNode1->appendChild(paramModeNode1);
		XmlNode* rgbNode = new XmlNode(m_pXmlManager, "RGB", NULL, NULL, rgbText); 
		paramsNode1->appendChild(rgbNode);

		baseFilterNode1->appendChild(tableTextureNode1);
		baseFilterNode1->appendChild(paramsNode1);

		if(!m_bIsCurveAllocation){
			m_pXmlManager->root()->appendChild(AllocationTexNode1);
			m_bIsCurveAllocation = true;
		}
		m_pXmlManager->root()->appendChild(baseFilterNode1);

		srcTextName = getSrcDstPic(true);
		dstTextName = getSrcDstPic(false);



		XmlNode* baseFilter2 =new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "TableTexture", NULL);
		XmlNode* srcNode2 = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* tableTextureDstNode2 = new XmlNode(m_pXmlManager, tableTextureNodeName, NULL, NULL, tableTextureNodeName);
		XmlNode* dstNode2 = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);

		baseFilter2->appendChild(srcNode2);
		baseFilter2->appendChild(dstNode2);
		baseFilter2->appendChild(tableTextureDstNode2);
		m_pXmlManager->root()->appendChild(baseFilter2);
	}

}


void DataParsingEngine::adjustCommonNode( char* nodeName,  char* intensityNodeName , char* intensity)
{

	XmlNode* baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", nodeName, NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);

	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* intensityNode = new XmlNode(m_pXmlManager, intensityNodeName, NULL, NULL, intensity);

	paramsNode->appendChild(intensityNode);
	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(dstNode);
	baseFilterNode->appendChild(paramsNode);

	m_pXmlManager->root()->appendChild(baseFilterNode);
}

void DataParsingEngine::adjustParser(const char* ptr, ConfigParser* parser)
{
	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);

	while(*ptr != '\0' && (*ptr == ' ' || *ptr == '\t')) ++ptr;
	float intensity;
	char* sIntensity = new char[32];
	if(strncmp(ptr, "brightness", 10) == 0)
	{
		ptr += 10;
		if(sscanf(ptr, "%f", &intensity) != 1)
		{
			printf("brightness params red errer!");
			return;
		}
		sprintf(sIntensity, "%.2f", intensity);
		adjustCommonNode("Brightness", "brightness", sIntensity);
	}
	else if(strncmp(ptr, "contrast", 8) == 0)
	{
		ptr += 8;
		if(sscanf(ptr, "%f", &intensity) != 1)
		{
			printf("contrast params red errer!");
			return;
		}
		sprintf(sIntensity, "%f", intensity);
		adjustCommonNode("Contrast", "contrast", sIntensity);
	}
	else if(strncmp(ptr, "saturation", 10) == 0)
	{
		ptr += 10;
		if(sscanf(ptr, "%f", &intensity) != 1)
		{
			printf("saturation params red errer!");
			return;
		}
		intensity -= 1.0f;
		sprintf(sIntensity, "%f", intensity);

		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSLAdjustment", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* paramsModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "normal");
		XmlNode* hueNode = new XmlNode(m_pXmlManager, "hue", NULL, NULL, "0.0");
		XmlNode* saturationNode = new XmlNode(m_pXmlManager, "saturation", NULL, NULL, sIntensity);
		XmlNode* lightnessNode = new XmlNode(m_pXmlManager, "lightness", NULL, NULL, "0.0");

		paramsNode->appendChild(paramsModeNode);
		paramsNode->appendChild(hueNode);
		paramsNode->appendChild(saturationNode);
		paramsNode->appendChild(lightnessNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
	}
	else if(strncmp(ptr, "sharpen", 7) == 0)
	{
		ptr += 7;
		if(sscanf(ptr, "%f", &intensity) != 1)
		{
			printf("sharpen params red errer!");
			return;
		}
		sprintf(sIntensity, "%f", intensity);
		adjustCommonNode("Sharpen", "sharpen", sIntensity);
	}
	else if(strncmp(ptr, "blur", 4) == 0)
	{
		ptr += 4;
		if(sscanf(ptr, "%f", &intensity) != 1)
		{
			printf("blur params red errer!");
			return;
		}
		sprintf(sIntensity, "%f", intensity);
		adjustCommonNode("Blur", "blur", sIntensity);
	}
	else if(strncmp(ptr, "whitebalance", 12) == 0)
	{
		ptr += 12;

		float temp, tint;
		char* sTemp = new char[32];
		char* sTint = new char[32];
		if(sscanf(ptr, "%f%*c%f", &temp, &tint) != 2)
		{
			return;
		}
		
		sprintf(sTemp, "%f", temp);
		sprintf(sTint, "%f", tint);

		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "WhiteBalance", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* temperatureNode = new XmlNode(m_pXmlManager, "temperature", NULL, NULL, sTemp);
		XmlNode* tintNode = new XmlNode(m_pXmlManager, "tint", NULL, NULL, sTint);

		paramsNode->appendChild(temperatureNode);
		paramsNode->appendChild(tintNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
		delete sTemp;
		delete sTint;
	}
	else if(strncmp(ptr, "shl", 3) == 0 || strncmp(ptr, "shadowhighlight", 15) == 0)
	{
		while(*ptr != '\0' && *ptr != ' ' && *ptr != '\t') ++ptr;

		float shadow, highlight;
		if(sscanf(ptr, "%f%*c%f", &shadow, &highlight) != 2)
		{
			return;
		}
		
		//QMessageBox::critical(this, QString::fromLocal8Bit("未包含次基础调整"), QString::fromLocal8Bit("高光阴影这个效果暂时没用！！"));
		
	}
	else if(strncmp(ptr, "hsv", 3) == 0)
	{
		ptr += 3;
		float arg[6];
		char sArg[6][32];
		if(sscanf(ptr, "%f%*c%f%*c%f%*c%f%*c%f%*c%f", 
			arg, arg+1, arg+2, arg+3, arg+4, arg+5) != 6)
		{
			return;
		}
		for (int i=0; i<6; i++)
		{
			sprintf(sArg[i], "%.2f", arg[i]);
		}

		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSVSaturation", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* paramsModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "normal");
		XmlNode* redNode = new XmlNode(m_pXmlManager, "red", NULL, NULL, sArg[0]);
		XmlNode* yellowNode = new XmlNode(m_pXmlManager, "yellow", NULL, NULL, sArg[1]);
		XmlNode* greenNode = new XmlNode(m_pXmlManager, "green", NULL, NULL, sArg[2]);
		XmlNode* cyanNode = new XmlNode(m_pXmlManager, "cyan", NULL, NULL, sArg[3]);
		XmlNode* blueNode = new XmlNode(m_pXmlManager, "blue", NULL, NULL, sArg[4]);
		XmlNode* magentaNode = new XmlNode(m_pXmlManager, "magenta", NULL, NULL, sArg[5]);

		paramsNode->appendChild(paramsModeNode);
		paramsNode->appendChild(redNode);
		paramsNode->appendChild(yellowNode);
		paramsNode->appendChild(greenNode);
		paramsNode->appendChild(cyanNode);
		paramsNode->appendChild(blueNode);
		paramsNode->appendChild(magentaNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
		
	}
	else if(strncmp(ptr, "hsl", 3) == 0)
	{
		ptr += 3;
		float h, s, l;
		char* sh = new char[32]; 
		char* ss = new char[32];
		char* sl = new char[32];
		if(sscanf(ptr, "%f%*c%f%*c%f", &h, &s, &l) != 3)
		{
			return;
		}

		sprintf(sh, "%.2f", h);
		sprintf(ss, "%.2f", s);
		sprintf(sl, "%.2f", l);

		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSLAdjustment", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* paramsModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "normal");
		XmlNode* hueNode = new XmlNode(m_pXmlManager, "hue", NULL, NULL, sh);
		XmlNode* saturationNode = new XmlNode(m_pXmlManager, "saturation", NULL, NULL, ss);
		XmlNode* lightnessNode = new XmlNode(m_pXmlManager, "lightness", NULL, NULL, sl);
	
		paramsNode->appendChild(paramsModeNode);
		paramsNode->appendChild(hueNode);
		paramsNode->appendChild(saturationNode);
		paramsNode->appendChild(lightnessNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
		delete sh;
		delete ss;
		delete sl;
	}
	else if(strncmp(ptr, "level", 5) == 0)
	{
		ptr += 5;
		float dark, light, gamma;
		char* sDark = new char[32];
		char* sLight = new char[32];
		char* sGamma = new char[32];

		if(sscanf(ptr, "%f%*c%f%*c%f", &dark, &light, &gamma) != 3)
		{
			return;
		}
		sprintf(sDark, "%.2f", dark);
		sprintf(sLight, "%.2f", light);
		sprintf(sGamma, "%.2f", gamma);

		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSVSaturation", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* typeNode = new XmlNode(m_pXmlManager, "type", NULL, NULL, "LevelSP");
		XmlNode* darkNode = new XmlNode(m_pXmlManager, "dark", NULL, NULL, sDark);
		XmlNode* lightNode = new XmlNode(m_pXmlManager, "light", NULL, NULL, sLight);

		paramsNode->appendChild(typeNode);
		paramsNode->appendChild(darkNode);
		paramsNode->appendChild(lightNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
		delete sDark;
		delete sLight;
		delete sGamma;
	}
	delete sIntensity;
}

void DataParsingEngine::lomoWithCurveParser(const char* ptr, ConfigParser* parser)
{
	//float params[5];
	//char sParams[5][32];
	//int isLinear = 0;
	//while(*ptr != '\0' && !isdigit(*ptr)) ++ptr;
	//if(sscanf(ptr, "%f%*c%f%*c%f%*c%f%*c%f%*c%d",
	//	&params, &params + 1, &params + 2, &params + 3, &params + 4, &isLinear) < 5)
	//{
	//	return;
	//}


	//for (int i=0; i<6; i++)
	//{
	//	//sprintf(sArg[i], "%.2f", arg[i]);
	//}


	//srcTextName = getSrcDstPic(true);
	//dstTextName = getSrcDstPic(false);
	//XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSVSaturation", NULL);
	//XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	//XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	//XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	//XmlNode* paramsModeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "normal");
	//XmlNode* redNode = new XmlNode(m_pXmlManager, "red", NULL, NULL, sParams[0]);
	//XmlNode* yellowNode = new XmlNode(m_pXmlManager, "yellow", NULL, NULL, sParams[1]);
	//XmlNode* greenNode = new XmlNode(m_pXmlManager, "green", NULL, NULL, sParams[2]);
	//XmlNode* cyanNode = new XmlNode(m_pXmlManager, "cyan", NULL, NULL, sParams[3]);
	//XmlNode* blueNode = new XmlNode(m_pXmlManager, "blue", NULL, NULL, sParams[4]);
	//XmlNode* magentaNode = new XmlNode(m_pXmlManager, "magenta", NULL, NULL, sParams[5]);

	//paramsNode->appendChild(paramsModeNode);
	//paramsNode->appendChild(redNode);
	//paramsNode->appendChild(yellowNode);
	//paramsNode->appendChild(greenNode);
	//paramsNode->appendChild(cyanNode);
	//paramsNode->appendChild(blueNode);
	//paramsNode->appendChild(magentaNode);

	//baseFilterNode->appendChild(srcNode);
	//baseFilterNode->appendChild(dstNode);
	//baseFilterNode->appendChild(paramsNode);

	//m_pXmlManager->root()->appendChild(baseFilterNode);

}

void DataParsingEngine::lomoParser(const char* ptr, ConfigParser* parser)
{
	//没用
}

void DataParsingEngine::colorScaleParser(const char* ptr, ConfigParser* parser)
{
	//没用
}

const char* constColorTextureName = "constColorTexture";
void DataParsingEngine::pixblendParser(const char* ptr, ConfigParser* parser)
{
	char blendMethod[1024];
	float color[4];
	char sColor[4][32];
	float intensity;
	char sIntensity[32];

	if(sscanf(ptr, "%1023s%f%f%f%f%f", blendMethod, color, color + 1, color + 2, color + 3, &intensity) != 6)
	{
		return;
	}
	intensity /= 100.0f;
	sprintf(sIntensity, "%.2f", intensity);
	for (int i=0; i<4; i++)
	{
		color[i] /= 255.0f;
		sprintf(sColor[i], "%.4f", color[i]);
	}


	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);
	XmlNode* AllocationTexNode = new XmlNode(m_pXmlManager, statementNodeName, "name", constColorTextureName,  NULL);
	XmlNode* baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "ConstColor", NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, "SRC");
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, constColorTextureName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* redNode = new XmlNode(m_pXmlManager, "red", NULL, NULL, sColor[0]);
	XmlNode* greenNode = new XmlNode(m_pXmlManager, "green", NULL, NULL, sColor[1]);
	XmlNode* blueNode = new XmlNode(m_pXmlManager, "blue", NULL, NULL, sColor[2]);
	
	paramsNode->appendChild(redNode);
	paramsNode->appendChild(greenNode);
	paramsNode->appendChild(blueNode);
	
	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(dstNode);
	baseFilterNode->appendChild(paramsNode);
	if(!m_bIsConstColorAllocation){
		m_pXmlManager->root()->appendChild(AllocationTexNode);
		m_bIsConstColorAllocation = true;
	}
	m_pXmlManager->root()->appendChild(baseFilterNode);

	char* blendName= blendModeStringParser[blendMethod];;
	XmlNode* baseFilterNode1 = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "LayerBlend", NULL);
	XmlNode* srcNode1 = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	XmlNode* texNode1 = new XmlNode(m_pXmlManager, "tex", NULL, NULL, constColorTextureName);
	XmlNode* dstNode1 = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	XmlNode* paramsNode1 = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* modeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, blendName);
	XmlNode* opacityNode = new XmlNode(m_pXmlManager, "opacity", NULL, NULL, sIntensity);
	paramsNode1->appendChild(modeNode);
	paramsNode1->appendChild(opacityNode);
	baseFilterNode1->appendChild(srcNode1);
	baseFilterNode1->appendChild(texNode1);
	baseFilterNode1->appendChild(dstNode1);
	baseFilterNode1->appendChild(paramsNode1);

	m_pXmlManager->root()->appendChild(baseFilterNode1);
	
}

void DataParsingEngine::specialParser(const char* ptr, ConfigParser* parser)
{
	//没用
}

void DataParsingEngine::krblendParser(const char* ptr, ConfigParser* parser)
{
	//不支持
}

void DataParsingEngine::vignetteParser(const char* ptr, ConfigParser* parser)
{
	char low[32], range[32], centerX[32], centerY[32];
	int n = sscanf(ptr, "%s%*c%s%*c%s%*c%s", &low, &range, &centerX, &centerY);
	if(n < 2)
	{
		return;
	}

	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);
	XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "HSVSaturation", NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* modeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "linear");
	XmlNode* lowNode = new XmlNode(m_pXmlManager, "dark", NULL, NULL, low);
	XmlNode* rangeNode = new XmlNode(m_pXmlManager, "light", NULL, NULL, range);

	paramsNode->appendChild(modeNode);
	paramsNode->appendChild(lowNode);
	paramsNode->appendChild(rangeNode);

	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(dstNode);
	baseFilterNode->appendChild(paramsNode);

	m_pXmlManager->root()->appendChild(baseFilterNode);
}

void DataParsingEngine::selfblendParser(const char* ptr, ConfigParser* parser)
{
	//none

}

void DataParsingEngine::colorMulParser(const char* ptr, ConfigParser* parser)
{
	char funcName[32] = "";
	if(sscanf(ptr,"%31s", funcName) != 1)
	{
		return;
	}

	if(strncmp(funcName, "flt", 3) == 0)
	{
		float value;
		if(sscanf(ptr, "%*s%f", &value) != 1)
		{
			return;
		}
	}
	else if(strncmp(funcName, "vec", 3) == 0)
	{
		float r, g, b;
		if(sscanf(ptr, "%*s%f%*c%f%*c%f", &r, &g, &b) != 3)
		{
			return;
		}
	}
	else if(strncmp(funcName, "mat", 3) == 0)
	{
		char mat[9][32];
		if(sscanf(ptr, "%*s%s%*c%s%*c%s%*c%s%*c%s%*c%s%*c%s%*c%s%*c%s",
			mat, mat + 1, mat + 2, mat + 3, mat + 4, mat + 5, mat + 6, mat + 7, mat + 8) != 9)
		{
			return;
		}
		
		char* ch = "";	
		QString s[3]={""};
		string s1;
		for (int j=0; j<3; j++)
		{
			ch = "";
			for (int i=0; i<3; i++)
			{
				 s1 = link(ch, mat[i+j*3]);
				 ch =  const_cast<char*>(s1.c_str());
				 if(i != 2)
					s1 = link(ch, ",");
				 ch =  const_cast<char*>(s1.c_str());
			}
			s[j] = ch;
		}

		srcTextName = getSrcDstPic(true);
		dstTextName = getSrcDstPic(false);
		XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "MultiplyMatrixPlusBias", NULL);
		XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
		XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
		XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
		XmlNode* rVecNode = new XmlNode(m_pXmlManager, "vectorR", NULL, NULL, s[0].toLocal8Bit());
		XmlNode* gVecNode = new XmlNode(m_pXmlManager, "vectorG", NULL, NULL, s[1].toLocal8Bit());
		XmlNode* bVecNode = new XmlNode(m_pXmlManager, "vectorB", NULL, NULL, s[2].toLocal8Bit());

		paramsNode->appendChild(rVecNode);
		paramsNode->appendChild(gVecNode);
		paramsNode->appendChild(bVecNode);

		baseFilterNode->appendChild(srcNode);
		baseFilterNode->appendChild(dstNode);
		baseFilterNode->appendChild(paramsNode);

		m_pXmlManager->root()->appendChild(baseFilterNode);
	}
}

void DataParsingEngine::vignetteBlendParser(const char* ptr, ConfigParser* parser)
{
	char blendMethod[1024];
	char color[4][32], intensity[32];
	char low[32], range[32], centerX[32], centerY[32];
	char kind[32] = "0";
	char* ch = "";
	char* vignetteCh = "";
	char* vignetteCenterCh = "";

	if(sscanf(ptr, "%1023s%s%s%s%s%s%s%s%s%s%d", blendMethod, color, color + 1, color + 2, color + 3, &intensity, &low, &range, &centerX, &centerY, &kind) < 10)
	{
		return;
	}

	string s;
	for (int i=0; i<4; i++)
	{
		s= link(ch, color[i]);
		ch = const_cast<char*>(s.c_str());
		if(i != 3)
			s = link(ch, ", ");
		 ch = const_cast<char*>(s.c_str());
	}

	string s1;
	s1 =  link(low, ", ");
	s1 = s1 + range;
	vignetteCh =  const_cast<char*>(s1.c_str());

	//vignetteCh = link(low, ", ");
	//vignetteCh = link(vignetteCh, range);

	s1 =  link(centerX, ", ");
	s1 = s1 + centerY;
	vignetteCenterCh =  const_cast<char*>(s1.c_str());

	//vignetteCenterCh = link(centerX, ", ");
	//vignetteCenterCh = link(vignetteCenterCh, centerY);


	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);
	XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "Vignette", NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);
	XmlNode* modeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "vigblend");
	XmlNode* blendModeNode = new XmlNode(m_pXmlManager, "blendMode", NULL, NULL, blendMethod);
	XmlNode* colorNode = new XmlNode(m_pXmlManager, "color", NULL, NULL, ch);
	XmlNode* intensityNode = new XmlNode(m_pXmlManager, "intensity", NULL, NULL, intensity);
	XmlNode* vignetteNode = new XmlNode(m_pXmlManager, "vignette", NULL, NULL, vignetteCh);
	XmlNode* vignetteCenterNode = new XmlNode(m_pXmlManager, "vignetteCenter", NULL, NULL, vignetteCenterCh);
	XmlNode* typeNode = new XmlNode(m_pXmlManager, "type", NULL, NULL, "3");

	paramsNode->appendChild(modeNode);
	paramsNode->appendChild(blendModeNode);
	paramsNode->appendChild(colorNode);
	paramsNode->appendChild(intensityNode);
	paramsNode->appendChild(vignetteNode);
	paramsNode->appendChild(vignetteCenterNode);
	paramsNode->appendChild(typeNode);

	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(dstNode);
	baseFilterNode->appendChild(paramsNode);

	m_pXmlManager->root()->appendChild(baseFilterNode);
}

void DataParsingEngine::selectiveColorParser(const char* ptr, ConfigParser* parser)
{
	srcTextName = getSrcDstPic(true);
	dstTextName = getSrcDstPic(false);
	XmlNode * baseFilterNode = new XmlNode(m_pXmlManager, baseFilterNodeName, "name", "SelectiveColor", NULL);
	XmlNode* srcNode = new XmlNode(m_pXmlManager, srcNodeName, NULL, NULL, srcTextName);
	XmlNode* dstNode = new XmlNode(m_pXmlManager, dstNodeName, NULL, NULL, dstTextName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);

	while(ptr != NULL && *ptr != '\0' && *ptr != '@')
	{
		char funcName[32];
		int  args[4];
		char sArgs[4][32];
		char *ch = "";
		while(*ptr != '\0' && (isspace(*ptr) || *ptr == ',')) ++ptr;
		if(*ptr == '\0' || *ptr == '@')
			break;
		if(sscanf(ptr, "%31[^( \t\n]%*[^-0-9.]%d%*c%d%*c%d%*c%d", funcName,args, args + 1, args + 2, args + 3) != 5)
		{
			printf("selectiveColorParser - Invalid Param %s!\n", ptr);
			break;
		}

		string s;
		for (int i=0; i<4; i++)
		{
			sprintf(sArgs[i], "%d", args[i]);
			//ch = link(ch, sArgs[i]);
			s = link(ch, sArgs[i]);
			ch =  const_cast<char*>(s.c_str());
			if(i != 3)
				s = link(ch, ",");
			ch =  const_cast<char*>(s.c_str());
		}

		while(*ptr != '\0' && *ptr++ != ')') ;

		if(strcmp(funcName, "red") == 0)
		{
			XmlNode* redNode = new XmlNode(m_pXmlManager, "red", NULL, NULL, ch);
			paramsNode->appendChild(redNode);
		}
		else if(strcmp(funcName, "green") == 0)
		{
			XmlNode* greenNode = new XmlNode(m_pXmlManager, "green", NULL, NULL, ch);
			paramsNode->appendChild(greenNode);
		}
		else if(strcmp(funcName, "blue") == 0)
		{
			XmlNode* blueNode = new XmlNode(m_pXmlManager, "blue", NULL, NULL, ch);
			paramsNode->appendChild(blueNode);
		}
		else if(strcmp(funcName, "cyan") == 0)
		{
			XmlNode* cyanNode = new XmlNode(m_pXmlManager, "cyan", NULL, NULL, ch);
			paramsNode->appendChild(cyanNode);
		}
		else if(strcmp(funcName, "magenta") == 0)
		{
			XmlNode* magentaNode = new XmlNode(m_pXmlManager, "magenta", NULL, NULL, ch);
			paramsNode->appendChild(magentaNode);
		}
		else if(strcmp(funcName, "yellow") == 0)
		{
			XmlNode* yellowNode = new XmlNode(m_pXmlManager, "yellow", NULL, NULL, ch);
			paramsNode->appendChild(yellowNode);
		}
		else if(strcmp(funcName, "white") == 0)
		{
			XmlNode* whiteNode = new XmlNode(m_pXmlManager, "white", NULL, NULL, ch);
			paramsNode->appendChild(whiteNode);
		}
		else if(strcmp(funcName, "gray") == 0)
		{
			XmlNode* grayNode = new XmlNode(m_pXmlManager, "gray", NULL, NULL, ch);
			paramsNode->appendChild(grayNode);
		}
		else if(strcmp(funcName, "black") == 0)
		{
			XmlNode* blackNode = new XmlNode(m_pXmlManager, "black", NULL, NULL, ch);
			paramsNode->appendChild(blackNode);
		}
		else
		{
			printf("Unknown funcName: %s!\n", funcName);
		}
	}

	baseFilterNode->appendChild(srcNode);
	baseFilterNode->appendChild(dstNode);
	baseFilterNode->appendChild(paramsNode);
	m_pXmlManager->root()->appendChild(baseFilterNode);
}

void DataParsingEngine::blendTileParser(const char* ptr, ConfigParser* parser)
{
	//none
}


string  DataParsingEngine::getTextureVariablesName(char*& ch)
{
	stringstream ss;
	string s;
	ss<< m_iTextureNum;
	ss >> s;

	string s1 = "texture";
	s1 =s1 + s;
	
	return s1;
}

string DataParsingEngine::link(char* ch1, char* ch2)
{
	string s1 = "";
	s1 = s1 + ch1;
	s1 = s1 + ch2;
	return s1;
}

char* DataParsingEngine::getSrcDstPic(bool isGetSrc)
{
	if(m_iStepIndex >= m_iStepNum)
		return NULL;

	if(isGetSrc)
	{
		return m_iStepIndex % 2 == 0 ? "SRC" : "TMP";
	}
	else
	{
		if(m_iStepIndex + 1 == m_iStepNum)
			return "DST";
		char* ch = (m_iStepIndex + 1) % 2 == 0 ? "SRC" : "TMP";
		m_iStepIndex++;
		return ch;
	}
	return NULL;
}



void DataParsingEngine::borderMParser(const char* pstr, ConfigParser* parser)
{
	char srcName[256];
	char w[6], h[6];
	char blocks[32][6];

	stringstream ss(pstr);
	ss >> srcName >> w >> h;
	for(int i = 0; i != 32; ++i)
		ss >> blocks[i];

	if(ss.fail() || ss.bad() || w == NULL || h == NULL)
	{
		printf("输入格式不对！");
		return;
	}
	
	XmlNode* unityNode = new XmlNode(m_pXmlManager, "Unity", NULL, NULL, srcName);
	XmlNode* paramsNode = new XmlNode(m_pXmlManager, paramNodeName, NULL, NULL, NULL);

	XmlNode* modeNode = new XmlNode(m_pXmlManager, "mode", NULL, NULL, "M");
	XmlNode* thicknessNode = new XmlNode(m_pXmlManager, "thickness", NULL, NULL, "0.1");
	XmlNode* widthNode = new XmlNode(m_pXmlManager, "width", NULL, NULL, w);
	XmlNode* heightNode = new XmlNode(m_pXmlManager, "height", NULL, NULL, h);

	paramsNode->appendChild(modeNode);
	paramsNode->appendChild(thicknessNode);
	paramsNode->appendChild(widthNode);
	paramsNode->appendChild(heightNode);
	
	char typeName[8][128] = {"leftTop","top", "rightTop", "right", "rightBottom", "bottom", "leftBottom", "left"};
	for (int i=0; i<8; i++)
	{
		XmlNode* blockNode = new XmlNode(m_pXmlManager, "block", "type", typeName[i], NULL);

		XmlNode* leftNode = new XmlNode(m_pXmlManager, "left", NULL, NULL, blocks[i*4]);
		XmlNode* topNode = new XmlNode(m_pXmlManager, "top", NULL, NULL, blocks[i*4 + 1]);
		XmlNode* widthNode = new XmlNode(m_pXmlManager, "width", NULL, NULL, blocks[i*4 + 2]);
		XmlNode* heightNode = new XmlNode(m_pXmlManager, "height", NULL, NULL, blocks[i*4 + 3]);

		blockNode->appendChild(leftNode);
		blockNode->appendChild(topNode);
		blockNode->appendChild(widthNode);
		blockNode->appendChild(heightNode);

		paramsNode->appendChild(blockNode);
	}

	
	m_pXmlManager->root()->appendChild(unityNode);
	m_pXmlManager->root()->appendChild(paramsNode);

}